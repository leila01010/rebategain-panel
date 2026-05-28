<script setup>
import { computed } from 'vue'
import { IrCard, IrDivider } from '@/lib/ui-kit'
import UpdateProfileAvatar from '@/components/profile/UpdateProfileAvatar.vue'
import { fullName, formatDate } from '@/utils/helpers.js'
import { useDevice } from '@/composables/useDevice.js'

const props = defineProps({
  user: { type: Object, required: true },
})

const { isPhone } = useDevice()

const name = computed(() => fullName(props.user))
</script>

<template>
  <IrCard class="profile-sidebar" body-class="!p-0">
    <div class="profile-sidebar__header">
      <UpdateProfileAvatar :size="isPhone ? 'md' : 'lg'" class="profile-sidebar__avatar" />
      <div>
        <div class="profile-sidebar__name">{{ name }}</div>
        <div class="profile-sidebar__email">{{ user.email }}</div>
      </div>
    </div>

    <IrDivider class="!m-0" />

    <div class="profile-sidebar__meta">
      <div class="profile-sidebar__row">
        <span class="profile-sidebar__label">{{ $t('profile.memberSince') }}</span>
        <span class="profile-sidebar__value">{{ formatDate(user.createdAt, 'MMM D, YYYY') }}</span>
      </div>
      <div class="profile-sidebar__row profile-sidebar__row--stack">
        <span class="profile-sidebar__label">{{ $t('profile.activeAccounts') }}</span>
      </div>
    </div>
  </IrCard>
</template>

<style lang="scss" scoped>
.profile-sidebar {
  width: 100%;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-dark-blue-600);
    margin-bottom: 4px;
  }

  &__email {
    font-size: 12px;
    color: var(--color-dark-blue-300);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    &--stack {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }
  }

  &__label {
    font-size: 12px;
    color: var(--color-dark-blue-300);
  }

  &__value {
    font-size: 12px;
    color: var(--color-dark-blue-600);
    font-weight: 500;
  }

  @media (max-width: 767px) {
    .profile-sidebar__header {
      flex-direction: row;
      gap: 16px;
    }
    .profile-sidebar__row {
      justify-content: flex-start;
    }
  }
}
</style>
