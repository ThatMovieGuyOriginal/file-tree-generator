// src/lib/preview-templates/base-template.ts
export const generateBaseHTML = (
  title: string,
  content: string,
  additionalStyles?: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        ${additionalStyles || ''}
    </style>
</head>
<body class="bg-gray-50">
    ${content}
</body>
</html>`;
};

export const generateGrid = (items: Array<{ title: string; value: string; trend: string; color: string }>) => {
  return items.map(item => `
    <div class="bg-gradient-to-r ${item.color} p-6 rounded-lg">
        <h3 class="text-sm font-medium opacity-90">${item.title}</h3>
        <p class="text-3xl font-bold">${item.value}</p>
        <p class="text-sm opacity-75">${item.trend}</p>
    </div>
  `).join('');
};
