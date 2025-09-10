"use server"

import { getApiClient } from "./api"

type AddFriendsToItemRequest = {
	item_id: number
	friend_ids: number[]
}

type AddFriendsResponse = {
	success: boolean
	item_id?: number
	error?: string
}

function extractErrorDetail(error: unknown): string | undefined {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as { response: unknown }).response === "object" &&
		(error as { response: unknown }).response !== null &&
		"data" in (error as { response: { data: unknown } }).response &&
		typeof ((error as { response: { data: unknown } }).response as { data: unknown }).data === "object" &&
		((error as { response: { data: { detail?: unknown } } }).response.data !== null) &&
		"detail" in (error as { response: { data: { detail?: unknown } } }).response.data
	) {
		const detail = (error as { response: { data: { detail?: unknown } } }).response.data.detail
		if (typeof detail === "string") {
			return detail
		}
	}
	return undefined
}

function extractErrorArray(error: unknown): AddFriendsResponse[] | undefined {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as { response: unknown }).response === "object" &&
		(error as { response: unknown }).response !== null &&
		"data" in (error as { response: { data: unknown } }).response
	) {
		const data = (error as { response: { data: unknown } }).response.data
		if (Array.isArray(data)) {
			return data as AddFriendsResponse[]
		}
	}
	return undefined
}

export async function addFriendsToItem(
	item_id: number,
	friend_ids: number[]
): Promise<AddFriendsResponse> {
	try {
		const api = await getApiClient()
		const response = await api.post("/items/add-friends", {
			item_id,
			friend_ids,
		})
		console.log(response)
		return response.data
	} catch (error) {
		return {
			success: false,
			item_id,
			error: extractErrorDetail(error) || "Failed to add friends to item.",
		}
	}
}

export async function addFriendsToMultipleItems(
	items: AddFriendsToItemRequest[]
): Promise<AddFriendsResponse[]> {
	try {
		const api = await getApiClient()
		const response = await api.post("/items/add-friends-multiple", {
			items,
		})
		return response.data
	} catch (error) {
		const errorArray = extractErrorArray(error)
		if (errorArray) {
			return errorArray
		}
		const detail = extractErrorDetail(error)
		return items.map((item) => ({
			success: false,
			item_id: item.item_id,
			error: detail || "Failed to add friends to item.",
		}))
	}
}
