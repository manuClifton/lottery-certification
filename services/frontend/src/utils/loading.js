function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function withMinimumDelay(promise, minimumMs = 1500) {
  const [result] = await Promise.all([promise, sleep(minimumMs)]);
  return result;
}
