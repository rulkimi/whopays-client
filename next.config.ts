/** @type {import('next').NextConfig} */
module.exports = {
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	images: {
		domains: [
			'127.0.0.1',
			'bucket.railway.internal'
		],
	},
}
