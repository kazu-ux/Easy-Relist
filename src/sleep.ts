export const sleep = (time: number) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
