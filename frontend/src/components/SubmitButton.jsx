export default function SubmitButton({ disabled, onSubmit }) {
  return (
    <button className="btn btn-submit" disabled={disabled} onClick={onSubmit}>
      Submit Recording
    </button>
  );
}