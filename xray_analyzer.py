"""
X-Ray Indicator Locator — uses Gemini API to find visual indicators
of a known diagnosis in a lung X-ray and return pixel coordinates.

Usage:
    python xray_analyzer.py <image_path> <diagnosis>
    python xray_analyzer.py chest.png Pneumonia
"""

import json
import sys
import os

from dotenv import load_dotenv
from PIL import Image
from google import genai

load_dotenv()


def build_prompt(diagnosis: str, width: int, height: int) -> str:
    return f"""You are a radiologist assistant. You are given a chest X-ray image
whose pixel dimensions are {width} x {height}.

The known diagnosis is: **{diagnosis}**

Identify the specific visual indicators / abnormalities in this X-ray that are
consistent with that diagnosis. For each indicator, provide:
- A short name
- A bounding box in absolute pixels: x, y, width, height (top-left origin)
- A one-sentence description

Return ONLY valid JSON matching this schema (no markdown fences):
{{
  "findings": [
    {{
      "name": "string",
      "x": int,
      "y": int,
      "w": int,
      "h": int,
      "description": "string"
    }}
  ]
}}

Make sure all coordinates fall within 0..{width - 1} (x) and 0..{height - 1} (y),
and that x+w <= {width} and y+h <= {height}."""


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python xray_analyzer.py <image_path> <diagnosis>")
        sys.exit(1)

    image_path = sys.argv[1]
    diagnosis = " ".join(sys.argv[2:])

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("Error: Set a valid GEMINI_API_KEY in .env")
        sys.exit(1)

    # Open image to get dimensions
    img = Image.open(image_path)
    width, height = img.size

    # Configure Gemini client
    client = genai.Client(api_key=api_key)

    prompt = build_prompt(diagnosis, width, height)

    # Upload the image and send to Gemini
    uploaded = client.files.upload(file=image_path)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[uploaded, prompt],
    )

    # Parse JSON from response
    text = response.text.strip()
    # Strip markdown fences if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    data = json.loads(text)
    findings = data.get("findings", [])

    # --- Output ---
    print(f"\nImage: {image_path} ({width} x {height} px)")
    print(f"Diagnosis: {diagnosis}\n")

    if not findings:
        print("No findings returned by model.")
        return

    print("Findings:")
    for i, f in enumerate(findings, 1):
        print(f"  {i}. {f['name']}")
        print(f"     Region: x={f['x']}, y={f['y']}, w={f['w']}, h={f['h']}")
        print(f"     Description: {f['description']}\n")

    print("Figma Coordinates (absolute px):")
    for f in findings:
        print(f"  - \"{f['name']}\": X={f['x']}, Y={f['y']}, W={f['w']}, H={f['h']}")
    print()


if __name__ == "__main__":
    main()


# figma = {}