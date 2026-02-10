<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const visible = ref(false)
const dontShowAgain = ref(false)

const STORAGE_KEY = 'bt-wiki-ai-disclaimer-seen'

onMounted(() => {
  if (lang.value === 'en' && !localStorage.getItem(STORAGE_KEY)) {
    visible.value = true
  }
})

function dismiss() {
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, '1')
  }
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="ai-disclaimer-overlay" @click.self="dismiss">
      <div class="ai-disclaimer-modal">
        <div class="ai-disclaimer-icon">AI</div>
        <h3 class="ai-disclaimer-title">AI-Generated Translation</h3>
        <p class="ai-disclaimer-text">
          The English version of this documentation has been generated using artificial intelligence.
          Some terms and content may not perfectly reflect the intended meaning and will be reviewed
          in a later phase of the Digital Platform development.
        </p>
        <label class="ai-disclaimer-checkbox">
          <input type="checkbox" v-model="dontShowAgain" />
          <span>Don't show this again</span>
        </label>
        <button class="ai-disclaimer-btn" @click="dismiss">Got it</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-disclaimer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.ai-disclaimer-modal {
  max-width: 460px;
  margin: 16px;
  padding: 32px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.ai-disclaimer-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  border-radius: 10px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-size: 16px;
  font-weight: 700;
}

.ai-disclaimer-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ai-disclaimer-text {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ai-disclaimer-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  user-select: none;
}

.ai-disclaimer-checkbox input {
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

.ai-disclaimer-btn {
  padding: 8px 32px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.ai-disclaimer-btn:hover {
  background: var(--vp-c-brand-2);
}
</style>
