import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// 启用 CORS
app.use('/*', cors());

// 健康检查
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// 背景移除 API
app.post('/api/remove-bg', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: 'No image provided' }, 400);
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'Invalid file type' }, 400);
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File too large (max 10MB)' }, 400);
    }

    // 调用 Remove.bg API
    const removeBgApiKey = c.env?.REMOVE_BG_API_KEY || 'your_remove_bg_api_key_here';
    
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
      return c.json({ error: `Remove.bg API error: ${error}` }, removeBgResponse.status);
    }

    // 返回处理后的图片
    const processedImage = await removeBgResponse.arrayBuffer();
    
    return c.body(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
