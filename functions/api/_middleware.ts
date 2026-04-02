// CORS 中间件
export async function onRequest(context: EventContext<Env, any, any>): Promise<Response | void> {
  const response = await context.next();
  
  // 添加 CORS 头
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
