export const paste = async () => navigator.clipboard.readText();
export const copy = async (text: string) => navigator.clipboard.writeText(text);
