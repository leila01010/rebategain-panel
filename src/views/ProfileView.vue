<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import ProfileTabs from '@/components/profile/ProfileTabs.vue'
import PersonalInformation from '@/components/profile/PersonalInformation.vue'
import SecuritySection from '@/components/profile/SecuritySection.vue'

const userStore = useUserStore()
const { user, loading } = storeToRefs(userStore)

const activeTab = ref('personal')
</script>

<template>
  <LoadingState v-if="loading && !user" />
  <div v-else-if="user">
    <PageHeader
      :title="$t('profile.myProfile')"
      :description="$t('profile.myProfileText')"
    />

    <div class="profile-layout">
      <ProfileSidebar :user="user" class="profile-layout__sidebar" />

      <div class="profile-layout__content">
        <ProfileTabs v-model="activeTab" class="profile-layout__tabs" />
        <KeepAlive>
          <PersonalInformation v-if="activeTab === 'personal'" />
          <SecuritySection v-else-if="activeTab === 'security'" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 256px) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-bottom: 24px;

  &__sidebar {
    position: sticky;
    top: 24px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 1023px) {
  .profile-layout {
    grid-template-columns: 1fr;

    &__sidebar {
      position: static;
    }
  }
}

@media (max-width: 767px) {
  .profile-layout__content {
    gap: 0;
  }
}
</style>
