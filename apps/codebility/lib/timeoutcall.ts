export async function makeApiCallWithTimeout(call: any, timeout: number) {
  const apiCallPromise = call

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout reached"))
    }, timeout)
  })

  try {
    const result = await Promise.race([apiCallPromise, timeoutPromise])
    return result
  } catch (error: any) {
    return null
  }
}
