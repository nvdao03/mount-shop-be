import { Router } from 'express'

const router = Router()

// --- Get Product Detail ---
router.get('/:product_id')

// --- Get Product List ---
router.get('/')

export default router
