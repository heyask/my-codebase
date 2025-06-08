import hljs from 'highlight.js';

export const getRandomCatImage = () => {
  const images = [
    '/assets/images/cat0.jpg',
    '/assets/images/cat1.jpg',
    '/assets/images/cat2.jpg',
  ];
  return images[Math.floor(Math.random() * images.length)];
};

hljs.configure({
  languages: ['javascript', 'json', 'bash', 'scss', 'css', 'yml', 'html'],
});

export default function highlightCode() {
  const codeBlocks = document.querySelectorAll('pre > code');
  codeBlocks.forEach((codeBlock) => {
    if (typeof codeBlock === 'object') {
      hljs.highlightBlock(codeBlock as HTMLElement);
    }
  });
}

export function urlSafeString(str: any) {
  return (
    String(str)
      .replace(/[^a-zA-Z0-9가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥0-9]/gi, '-')
      // .replace(/[^\w\s]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  );
}
