<template>
  <div>
    <h1>通知消息列表</h1>
    <ul>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.notifierName }}回复了你的{{ notification.typeName }}
        {{ notification.outerName }} ||时间{{ notification.created }}
      </li>
    </ul>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      notifications: [],
    };
  },
  mounted() {
    // 在组件加载完成后连接 WebSocket
    const ws = new WebSocket("ws://localhost:8888/notification");
    ws.onopen = () => {
      console.log("WebSocket 连接成功");
    };
    ws.onmessage = (event) => {
      // 接收到消息时更新通知列表
      const notification = JSON.parse(event.data);
      this.notifications.unshift(notification);
      console.log("event--------------->", event);
      console.log("notification--------------->", notification);
    };
    ws.onclose = () => {
      console.log("WebSocket 连接关闭");
    };
    ws.onerror = (error) => {
      console.log("WebSocket 连接错误", error);
    };
  },
};
</script>
