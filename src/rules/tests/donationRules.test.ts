import {
    formatDonationDate,
    getAvailablePickupDates,
    isNearOffice,
    isPickupDateAvailable,
    validateDonation,
} from "../donationRule.ts";

import { describe, it, expect } from 'vitest'

describe('isNearOffice', () => {
    it('Returns true when first two digits match', () => {
        expect(isNearOffice('27432', '27404')).toBe(true)
    })

    it('Returns false when first two digits differ', () => {
        expect(isNearOffice('27432', '28500')).toBe(false)
    })

    it('Returns false for invalid inputs', () => {
        expect(isNearOffice('2743', '27404')).toBe(false)
        expect(isNearOffice('abcde', '27404')).toBe(false)
        expect(isNearOffice('', '27404')).toBe(false)
        expect(isNearOffice('27432', '')).toBe(false)
    })
})

describe('pickup date helpers', () => {
    const today = new Date('2026-02-10T12:00:00')

    it('Lists only weekdays and starts after 3 days', () => {
        const dates = getAvailablePickupDates(today, 4)
        expect(dates).toEqual(['2026-02-13', '2026-02-16', '2026-02-17', '2026-02-18'])
    })

    it('Accepts only available pickup dates', () => {
        expect(isPickupDateAvailable('2026-02-13', today)).toBe(true)
        expect(isPickupDateAvailable('2026-02-12', today)).toBe(false)
        expect(isPickupDateAvailable('2026-02-14', today)).toBe(false)
        expect(isPickupDateAvailable('not-a-date', today)).toBe(false)
    })
})

describe('validateDonation', () => {
    const officePLZ = '27432'
    const today = new Date('2026-02-10T12:00:00')

    it('Office mode: requires clothingType + crisisRegion, address may be missing', () => {
        const ok = validateDonation(
            {
                mode: 'office',
                clothingType: 'Winterbekleidung',
                crisisRegion: "Jemen",
            },
            officePLZ,
            today
        )
        expect(ok).toEqual({ok: true})
    })

    it('Pickup mode: requires street + postalcode + city. PostalCode must be near', () => {
        const res = validateDonation(
            {
                mode: 'pickup',
                clothingType: 'Winterbekleidung',
                crisisRegion: 'Jemen',
                street: 'Musterstraße 1',
                postalCode: '28500',
                city: 'Musterstadt',
                pickupDate: '2026-02-13',
                pickupTimeSlot: '10-14',
            },
            officePLZ,
            today
        )

        expect(res.ok).toBe(false)
        if (!res.ok) {
            expect(res.errors.postalCode).toBeTruthy()
        }
    })

    it('missing clothingType -> error["clothingType"]', () => {

        const res = validateDonation(
            {
                mode: 'office',
                // @ts-ignore
                clothingType:'',
                crisisRegion:'Jemen'
            },
            officePLZ,
            today
        )

        expect(res.ok).toBe(false)
        if (!res.ok) {
            expect(res.errors.clothingType).toBeTruthy()
        }
    })

    it('missing crisisRegion -> error["crisisRegion"]', () => {
        const res = validateDonation(
            {
                mode: 'office',
                clothingType:'Winterbekleidung',
                // @ts-ignore
                crisisRegion:'',
            },
            officePLZ,
            today
        )

        expect(res.ok).toBe(false)
        if(!res.ok) {
            expect(res.errors.crisisRegion).toBeTruthy()
        }
    })
})

describe('formatDonationDate',() => {
    it('Contains date and time for a fixed timestamp', () => {
        const timestamp = Date.UTC(2024, 0, 15, 13, 45, 0)
        const result = formatDonationDate(timestamp, 'de-DE')
        expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/)
        expect(result).toMatch(/\d{2}:\d{2}/)
    })
})