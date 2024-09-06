export default function generateCode(digits: number): string {
  let codeBuilder = "";

  for (let i = 0; i < digits; i++)
    codeBuilder += Math.floor(Math.random() * 10);

  return codeBuilder;
}
