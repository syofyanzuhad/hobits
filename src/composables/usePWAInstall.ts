import { ref, onMounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstallable = ref(false)
const isInstalled = ref(false)

export function usePWAInstall() {
  onMounted(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
      return
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      isInstallable.value = true
    })

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })
  })

  async function installApp() {
    if (!deferredPrompt.value) return false

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      isInstallable.value = false
      deferredPrompt.value = null
      return true
    }

    return false
  }

  return {
    isInstallable,
    isInstalled,
    installApp
  }
}
