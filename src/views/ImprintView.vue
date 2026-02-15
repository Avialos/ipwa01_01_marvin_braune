<script setup lang="ts">
import {computed} from "vue";
import {RouterLink} from "vue-router";
import {type PickupTimeSlot, useRegistrationState} from "../state/registrationState.ts";


const state = useRegistrationState()
const registration = computed(() => state.lastRegistration)

const registrationDateTime = computed(() => {
  const r = registration.value
  if(!r) return ''
  return formatDonationDate(Date.parse(r.timestamp), 'de-DE')
})
</script>

<template>
  <div>Test</div>
</template>

<style scoped>

</style>