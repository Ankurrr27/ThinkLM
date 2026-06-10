export default function ChatBox({
  answer,
}: {
  answer: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h3>AI Response</h3>

      <p>{answer}</p>
    </div>
  );
}