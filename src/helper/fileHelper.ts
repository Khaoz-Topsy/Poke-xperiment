export const readFileAsync = (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
};

export const readImageFileAsync = (file: any): Promise<{ width: number; height: number }> => {
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.src = url;
  });
};
