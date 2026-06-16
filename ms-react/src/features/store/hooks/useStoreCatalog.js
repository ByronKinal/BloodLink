import { useEffect, useState } from 'react'
import { fetchAllRewards, redeemReward, fetchWalletById } from '../../../shared/api/rewards.api.js'
import { getStoredAuth } from '../../../shared/utils/auth.store.js'

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'No se pudo completar la operación.'
}

export function useStoreCatalog() {
  const [rewards, setRewards] = useState([])
  const [walletPoints, setWalletPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [redeemingId, setRedeemingId] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError('')

    const auth = getStoredAuth()
    const userId = auth?.user?.id

    try {
      const [rewardsRes, walletRes] = await Promise.all([
        fetchAllRewards(),
        userId ? fetchWalletById(userId) : Promise.resolve({ data: { data: { balancePoints: 0 } } })
      ])

      const rewardsData = rewardsRes.data?.data ?? rewardsRes.data ?? []
      setRewards(rewardsData.filter((reward) => reward.status !== false))

      const walletData = walletRes.data?.data ?? walletRes.data ?? {}
      setWalletPoints(walletData.balancePoints ?? walletData.balance_points ?? 0)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRedeem = async (rewardId, requiredPoints) => {
    try {
      setRedeemingId(rewardId)
      setError('')

      await redeemReward({ rewardId, quantity: 1 })

      // Subtract points in UI
      setWalletPoints((prev) => Math.max(0, prev - requiredPoints))

      // Subtract stock in UI
      setRewards((prev) =>
        prev.map((r) =>
          r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r
        )
      )
    } catch (redeemError) {
      setError(getErrorMessage(redeemError))
    } finally {
      setRedeemingId(null)
    }
  }

  return {
    rewards,
    walletPoints,
    loading,
    error,
    redeemingId,
    handleRedeem,
  }
}
