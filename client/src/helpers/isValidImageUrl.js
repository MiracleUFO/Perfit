const isValidImageUrl = (url) => {
    const img = new Image();
    img.src = url;
    
    if (img.complete) {
      return url;
    } else {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(url);
            };
            img.onerror = () => {
                reject(false);
            };
        });
    }
};

export default isValidImageUrl;