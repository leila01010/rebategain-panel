<script setup>
import { computed, ref } from 'vue'
import { IrIcon, IrDropdown, IrAvatar } from '@/lib/ui-kit'
import UpdateProfileAvatar from '@/components/profile/UpdateProfileAvatar.vue'
import { useUserStore } from '@/stores/user.js'
import { useI18n } from 'vue-i18n'
import { fullName, maskMiddle } from '@/utils/helpers.js'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { storage } from '@/services/storage.service.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const signingOut = ref(false)

const { user } = storeToRefs(userStore)

const name = computed(() => fullName(user.value) || t('profile.user'))

const avatar = computed(() => {
  const avatar = user.value.media.length ? user.value.media[0] : {}
  return avatar.url
})

function onDashboard(close) {
  close()
  router.push({ name: 'profile' })
}

async function onSignOut(close) {
  if (signingOut.value) return
  signingOut.value = true
  try {
    const res = await http.post(api.logout)
    storage.remove('token')
    const logoutUrl = res?.data?.logoutUrl
    if (logoutUrl) {
      window.location.href = logoutUrl
    } else {
      close()
    }
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <IrDropdown class="user-menu" align="end" :min-width="220" :max-width="220" max-height="none">
    <template #trigger>
      <div class="user-menu__trigger">
        <div class="user-menu__trigger-avatar">
          <IrAvatar :src="avatar" :alt="name" size="sm" object-fit="cover" />
        </div>
        <div class="user-menu__trigger-meta">
          <div class="user-menu__trigger-name">{{ name }}</div>
          <div class="user-menu__trigger-plan" v-text="t('common.profile.proAccount')" />
        </div>
      </div>
    </template>

    <template #content="{ close }">
      <div class="user-menu__panel">
        <div class="user-menu__header">
          <UpdateProfileAvatar class="user-menu__avatar" />
          <div class="user-menu__name">{{ name }}</div>
          <div class="user-menu__email">{{ maskMiddle(user.email, { charStart: 12, charEnd: 2, mask: '***' }) }}</div>
        </div>

        <button type="button" class="user-menu__item" @click="onDashboard(close)">
          <span class="user-menu__item-label">
            {{ t('common.profile.myDashboard') }}
            <!--<span class="user-menu__item-dot" />-->
          </span>
          <IrIcon name="arrow-right" class="user-menu__item-icon icon-flip-rtl" />
        </button>

        <button
          type="button"
          class="user-menu__item"
          :disabled="signingOut"
          @click="onSignOut(close)"
        >
          <span class="user-menu__item-label">
            {{ t('common.profile.signOut') }}
          </span>
          <IrIcon
            :name="signingOut ? 'spinner' : 'logout'"
            class="user-menu__item-icon icon-flip-rtl"
          />
        </button>
      </div>
    </template>
  </IrDropdown>
</template>

<style lang="scss">
.user-menu {
  .ir-dropdown__icon {
    width: 12px !important;
    height: 12px !important;
  }
}
.user-menu__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-menu__trigger-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-blue-50);
}

.user-menu__trigger-avatar :deep(.ir-img),
.user-menu__trigger-avatar :deep(.ir-img__image) {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.user-menu__trigger-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.user-menu__trigger-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark-blue-600);
  margin-bottom: 4px;
}

.user-menu__trigger-plan {
  font-size: 12px;
  color: var(--color-dark-blue-300);
}

.user-menu__panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-menu__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 12px 16px;
  overflow: hidden;
}

.user-menu__avatar {
  margin-bottom: 12px;
}

.user-menu__edit {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-dark-blue-50);
  border-radius: 50%;
  background-color: #ffffff;
  color: var(--color-dark-blue-600);
  cursor: pointer;
  padding: 0;
  transition: background 0.15s;
}

.user-menu__edit:hover {
  background: var(--color-blue-600);
}

.user-menu__edit :deep(svg) {
  width: 12px;
  height: 12px;
}

.user-menu__name {
  font-size: 14px;
  color: var(--color-dark-blue-600);
  margin-bottom: 4px;
}

.user-menu__email {
  font-size: 12px;
  color: var(--color-dark-blue-300);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-dark-blue-50);
  background: none;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-dark-blue-600);
  transition: background 0.15s;
}

.user-menu__item:hover {
  background: var(--color-blue-20);
}

.user-menu__item:disabled {
  cursor: default;
  opacity: 0.7;
}

.user-menu__item-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.user-menu__item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-danger);
}

.user-menu__item-icon {
  width: 14px !important;
  height: 14px !important;
  color: var(--color-dark-blue-300);
}

@media (max-width: 767px) {
  .user-menu__trigger-meta {
    display: none;
  }

  .user-menu :deep(.ir-dropdown__icon) {
    display: none;
  }
}
</style>
