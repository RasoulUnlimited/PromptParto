document.getElementById('splitButton').addEventListener('click', () => {
    const input = document.getElementById('promptInput').value;
    const parts = input.split('\n\n');  // فرض تقسیم بر اساس دو خط فاصله
    const output = parts.map((part, i) => `### Part ${i + 1}\n${part}`).join('\n\n');
    document.getElementById('output').textContent = output;
  });
  