export enum POST_DATA_METHOD {
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  GET = 'GET',
}
export async function postData(method: POST_DATA_METHOD, url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (
    response.ok &&
    response.headers.get('Content-Type')?.includes('application/json')
  ) {
    return await response.json(); // Chỉ phân tích cú pháp khi có dữ liệu JSON
  } else {
    return response.statusText; // Hoặc trả về một thông báo lỗi tùy chỉnh hoặc một đối tượng trạng thái
  }
}
