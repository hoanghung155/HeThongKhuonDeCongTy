import { ref, shallowRef, onMounted, onUnmounted } from 'vue'

interface Options {
  urlRoot: string           // 例 "ws://localhost:8000/ws"
  clientId: string
  maxRetry?: number
}

export function useSocket({ urlRoot, clientId, maxRetry = 6 }: Options) {
  const ws = shallowRef<WebSocket | null>(null)
  const connected = ref(false)
  const messages  = ref<Array<{ me: boolean; text: string }>>([])
  const retryCnt  = ref(0)

  const connect = () => {
    ws.value = new WebSocket(`${urlRoot}/${encodeURIComponent(clientId)}`)

    ws.value.addEventListener('open', () => {
      connected.value = true
      retryCnt.value  = 0
    })

    ws.value.addEventListener('message', e => {
      const data = e.data as string
      if (data === 'heartbeat') {
        ws.value!.send('heartbeat')
        return
      }
      messages.value.push({ me: false, text: data })
    })

    ws.value.addEventListener('close', tryReconnect)
    ws.value.addEventListener('error', () => ws.value?.close())
  }

  const tryReconnect = () => {
    connected.value = false
    if (retryCnt.value >= maxRetry) return
    const delay = Math.min(10000, 500 * 2 ** retryCnt.value)
    setTimeout(connect, delay)
    retryCnt.value++
  }

  const send = ( type:string, to: string, text: string) => {
    if (!connected.value) return
    const payload = JSON.stringify({type:type, ID: to,  msg: text })
    ws.value!.send(payload)
    messages.value.push({ me: true, text })
  }

  onMounted(connect)
  onUnmounted(() => ws.value?.close(1000, 'bye'))

  return { connected, messages, send }
}
