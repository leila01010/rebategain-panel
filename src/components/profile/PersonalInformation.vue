<script setup>
import { computed, ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { IrCard, IrIcon, IrButton, IrInput, message } from '@/lib/ui-kit'
import PhoneInput from '@/components/form/PhoneInput.vue'
import CountrySelect from '@/components/select/CountrySelect.vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia'
import { useDevice } from '@/composables/useDevice.js'

const { t } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { isPhone } = useDevice()

const editing = ref(false)
const submitting = ref(false)

const { handleSubmit, setValues } = useForm()

const { value: firstName, errorMessage: firstNameError } = useField(
  'firstName',
  (v) => (v?.trim() ? true : t('profile.errors.nameRequired')),
  { initialValue: user.value.firstName ?? '' },
)

const { value: lastName, errorMessage: lastNameError } = useField(
  'lastName',
  (v) => (v?.trim() ? true : t('profile.errors.lastNameRequired')),
  { initialValue: user.value.lastName ?? '' },
)

const { value: phone, errorMessage: phoneError } = useField(
  'phone',
  (v) => (v?.trim() ? true : t('profile.errors.phoneRequired')),
  { initialValue: user.value.phone ?? '' },
)

const { value: countryId } = useField('countryId', null, {
  initialValue: user.value?.countryId * 1 ?? '',
})

const callingCode = ref(user.value?.callingCode)

const displayPhone = computed(() => {
  const code = user.value?.callingCode || ''
  const phone = user.value?.phone || ''
  return phone ? `${code}${phone}` : '-'
})

const displayCountry = computed(() => user.value.country?.name || '-')

function startEdit() {
  setValues({
    values: {
      firstName: user.value.firstName ?? '',
      lastName: user.value.lastName ?? '',
      phone: user.value.phone ?? '',
      countryId: user.value.countryId ?? '',
      callingCode: user.value.callingCode ?? '',
    },
  })
  editing.value = true
}

function cancel() {
  editing.value = false
}

const submit = handleSubmit(async (values) => {
  if (submitting.value) return
  const data = {
    ...values,
    callingCode: callingCode.value,
  }
  submitting.value = true
  try {
    const res = await http.patch(api.user, data)
    user.value = {
      ...res?.data,
      avatar: res?.data?.media?.[0]?.url || '',
    }
    message.success(t('profile.updateSuccess'))
    editing.value = false
  } catch {
    // http.js toasts the error
  } finally {
    submitting.value = false
  }
})

watch(
  () => user,
  (u) => {
    if (editing.value) return
    firstName.value = u?.firstName ?? ''
    lastName.value = u?.lastName ?? ''
    phone.value = u?.phone ?? ''
    callingCode.value = u?.callingCode ?? ''
    countryId.value = u?.countryId * 1 ?? ''
  },
  { deep: true },
)
</script>

<template>
  <IrCard class="personal-info" body-class="!p-4 md:!p-8">
    <template #header v-if="!isPhone">
      <div class="personal-info__header">
        <div class="personal-info__title">
          <IrIcon name="user" :size="16" />
          <span>{{ $t('profile.tabs.personalInformation') }}</span>
        </div>
      </div>
    </template>

    <form v-if="editing" @submit.prevent="submit">
      <div class="personal-info__grid">
        <IrInput
          v-model="firstName"
          :label="$t('profile.fields.name')"
          :error="firstNameError"
          block
        />
        <IrInput
          v-model="lastName"
          :label="$t('profile.fields.lastName')"
          :error="lastNameError"
          block
        />
        <PhoneInput
          v-model="phone"
          v-model:country="callingCode"
          :label="$t('profile.fields.phoneNumber')"
          :error="phoneError"
        />
        <CountrySelect
          v-model="countryId"
          :label="$t('profile.fields.countryRegion')"
          :placeholder="$t('profile.fields.countryRegion')"
          block
        />
      </div>

      <div class="personal-info__actions">
        <IrButton variant="text" color="secondary" :text="$t('profile.cancel')" @click="cancel" />
        <IrButton :text="$t('profile.saveChanges')" :loading="submitting" @click="submit" />
      </div>
    </form>

    <div v-else class="personal-info__view">
      <div class="personal-info__grid">
        <div class="personal-info__field">
          <div class="personal-info__label">{{ $t('profile.fields.name') }}</div>
          <div class="personal-info__value">{{ user.firstName || '-' }}</div>
        </div>
        <div class="personal-info__field">
          <div class="personal-info__label">{{ $t('profile.fields.lastName') }}</div>
          <div class="personal-info__value">{{ user.lastName || '-' }}</div>
        </div>
        <div class="personal-info__field">
          <div class="personal-info__label">{{ $t('profile.fields.phoneNumber') }}</div>
          <div class="personal-info__value">{{ displayPhone }}</div>
        </div>
        <div class="personal-info__field">
          <div class="personal-info__label">{{ $t('profile.fields.countryRegion') }}</div>
          <div class="personal-info__value">{{ displayCountry }}</div>
        </div>
      </div>
      <IrButton
        variant="outline"
        color="secondary"
        size="sm"
        :text="$t('profile.edit')"
        append-icon="edit-two"
        class="personal-info__edit-btn"
        @click="startEdit"
      />
    </div>
  </IrCard>
</template>

<style lang="scss" scoped>
.personal-info {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-dark-blue-600);
  }

  &__view {
    position: relative;
  }

  &__edit-btn {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &--with-action {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
  }

  &__label {
    font-size: 12px;
    color: var(--color-dark-blue-300);
    margin-bottom: 4px;
  }

  &__value {
    font-size: 14px;
    color: var(--color-dark-blue-600);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 48px;
  }
}

@media (max-width: 767px) {
  .personal-info {
    margin: 0 -16px;
    border-radius: 0;
  }
  .personal-info__grid {
    grid-template-columns: 1fr;
  }

  .personal-info__field--with-action {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
