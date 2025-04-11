import '../styles/globals.css'; // 引入全局样式 (如果存在)
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />; // 渲染当前页面组件，并传递 props
}

export default MyApp; // 使用 `export default` 导出 MyApp 组件

