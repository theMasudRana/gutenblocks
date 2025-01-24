// This array contains the template for the pricing table block.
const pricingTemplate = [
	[
		'core/heading',
		{
			level: 3,
			className: 'gtb-pricing__title',
			content: 'Premium',
		},
	],
	[
		'core/paragraph',
		{
			className: 'gtb-pricing__featured',
			content: 'Featured',
		},
	],
	[
		'core/paragraph',
		{
			className: 'gtb-pricing__subtitle',
			content: 'Suitable for enterprise',
		},
	],
	[
		'core/paragraph',
		{
			className: 'gtb-pricing__price',
			content: '$280/month',
		},
	],
	[
		'core/list',
		{ className: 'gtb-pricing__features' },
		[
			[ 'core/list-item', { content: '1TB Storage' } ],
			[ 'core/list-item', { content: 'Unlimited Projects' } ],
			[ 'core/list-item', { content: 'Community Access' } ],
			[ 'core/list-item', { content: 'Free Backup' } ],
			[ 'core/list-item', { content: 'Custom Integrations' } ],
		],
	],
	[
		'core/button',
		{
			className: 'gtb-pricing__button',
			text: 'Buy Now',
			url: '#',
		},
	],
];

export default pricingTemplate;
