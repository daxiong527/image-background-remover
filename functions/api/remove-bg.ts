export async function onRequestPost(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const request = context.request;
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 调用 Remove.bg API
    const removeBgApiKey = context.env?.REMOVE_BG_API_KEY || 'your_remove_bg_api_key_here';
    
    // 构建 FormData 传递给 Remove.bg
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', file);
    removeBgFormData.append('size', 'auto');
    
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': removeBgApiKey,
      },
      body: removeBgFormData,
    });

    if (!removeBgResponse.ok) {
      const error = await removeBgResponse.text();
      return new Response(JSON.stringify({ error: `Remove.bg API error: ${error}` }), { 
        status: removeBgResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 返回处理后的图片
    const processedImage = await removeBgResponse.arrayBuffer();
    
    return new Response(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
