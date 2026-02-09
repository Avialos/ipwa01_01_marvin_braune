import { reactive } from "vue";

export type DeliveryMode = 'office' | 'pickup'

export const CLOTHING_OPTIONS = [
    'Winterbekleidung',
    'Sommerbekleidung',
    'Kinderbekleidung',
    'Schuhe',
    'Gemischt'
] as const

export type Clothing = typeof CLOTHING_OPTIONS[number]

export const CRISIS_REGION_OPTIONS = [
    'Sudan',
    'Gaza',
    'Ukraine',
    'Syrien',
    'Jemen',
    'Afghanistan',
    'Südsudan'
] as const

export type CrisisRegion = typeof CRISIS_REGION_OPTIONS[number]

export const PICKUP_TIME_SLOTS = ['10-14', '14-18'] as const

export type PickupTimeSlot = typeof PICKUP_TIME_SLOTS[number]

type OfficeRegistration = {
    mode: 'office';
    clothingType: Clothing;
    crisisRegion: CrisisRegion;
    timestamp: string;
}

type PickupRegistration = {
    mode: 'pickup';
    clothingType: Clothing;
    crisisRegion: CrisisRegion;
    street: string;
    postalCode: string;
    city: string;
    pickupDate: string;
    pickupTimeSlot: PickupTimeSlot;
    timestamp: string
}

export type IRegistrationData = OfficeRegistration | PickupRegistration

export const OFFICE_POSTAL_CODE = '27432'

const state = reactive<{
    lastRegistration: IRegistrationData | null
}>({
    lastRegistration: null,
})

export function setLastRegistration(data: IRegistrationData) {
    state.lastRegistration = data;
}

export function useRegistrationState() {
    return state
}