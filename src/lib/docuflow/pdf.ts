function latin(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** One-page PDF, Helvetica only. Returns base64. */
export function buildSimplePdf(title: string, lines: string[]): string {
  const commands = ["BT", "/F1 18 Tf", "50 790 Td", `(${latin(title).slice(0, 80)}) Tj`, "/F1 11 Tf"];
  for (const line of lines.slice(0, 36)) {
    commands.push("0 -18 Td", `(${latin(line).slice(0, 100)}) Tj`);
  }
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(body, "latin1").toString("base64");
}
