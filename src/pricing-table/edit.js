/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	Button,
	TextControl,
} from '@wordpress/components';
import { Icon, close } from '@wordpress/icons';

/**
 * Posts Grid Block Edit Component
 *
 * @param {Object}   props               Component properties
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Block attributes update function
 *
 * @return {JSX.Element}                Block edit component
 */
const Edit = ( { attributes, setAttributes } ) => {
	const {
		title,
		subtitle,
		currency,
		pricePeriod,
		price,
		onSale,
		salePrice,
		priceSeparator,
		buttonText,
		buttonUrl,
		featured,
		features,
	} = attributes;

	// Update the features array
	const handleUpdateFeature = ( index, field, value ) => {
		const updatedFeatures = features.map( ( feature, i ) =>
			i === index ? { ...feature, [ field ]: value } : feature
		);
		setAttributes( { features: updatedFeatures } );
	};

	// Remove a feature
	const removeFeature = ( indexToRemove ) => {
		setAttributes( {
			features: features.filter(
				( _, index ) => index !== indexToRemove
			),
		} );
	};

	// Add a new feature
	const addFeature = () => {
		const newFeature = {
			text: 'Feature',
		};
		setAttributes( {
			features: [ ...features, newFeature ],
		} );
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Pricing Info', 'gutenblocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Title', 'gutenblocks' ) }
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
					/>
					<TextControl
						label={ __( 'Subtitle', 'gutenblocks' ) }
						value={ subtitle }
						onChange={ ( value ) =>
							setAttributes( { subtitle: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Featured', 'gutenblocks' ) }
						checked={ featured }
						onChange={ ( value ) =>
							setAttributes( { featured: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Price', 'gutenblocks' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Price', 'gutenblocks' ) }
						value={ price }
						onChange={ ( value ) =>
							setAttributes( { price: value } )
						}
					/>
					<ToggleControl
						label={ __( 'On Sale', 'gutenblocks' ) }
						checked={ onSale }
						onChange={ ( value ) =>
							setAttributes( { onSale: value } )
						}
					/>
					{ onSale && (
						<TextControl
							label={ __( 'Sale Price', 'gutenblocks' ) }
							value={ salePrice }
							onChange={ ( value ) =>
								setAttributes( { salePrice: value } )
							}
						/>
					) }
					<TextControl
						label={ __( 'Currency', 'gutenblocks' ) }
						value={ currency }
						onChange={ ( value ) =>
							setAttributes( { currency: value } )
						}
					/>
					<TextControl
						label={ __( 'Period', 'gutenblocks' ) }
						value={ pricePeriod }
						onChange={ ( value ) =>
							setAttributes( { pricePeriod: value } )
						}
					/>
					<TextControl
						label={ __( 'Price Separator', 'gutenblocks' ) }
						value={ priceSeparator }
						onChange={ ( value ) =>
							setAttributes( { priceSeparator: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Features', 'gutenblocks' ) }
					initialOpen={ false }
				>
					{ features.map( ( feature, index ) => (
						<PanelBody
							key={ index }
							title={ `Feature ${ index + 1 }` }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Feature', 'gutenblocks' ) }
								value={ feature.text }
								onChange={ ( value ) => {
									handleUpdateFeature( index, 'text', value );
								} }
							/>
							<Button
								variant="secondary"
								isDestructive={ true }
								onClick={ () => {
									removeFeature( index );
								} }
							>
								<Icon icon={ close } />
							</Button>
						</PanelBody>
					) ) }
					<Button variant="primary" onClick={ addFeature }>
						{ __( 'Add Feature', 'gutenblocks' ) }
					</Button>
				</PanelBody>
				<PanelBody
					title={ __( 'Button', 'gutenblocks' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Text', 'gutenblocks' ) }
						value={ buttonText }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
					/>
					<TextControl
						label={ __( 'URL', 'gutenblocks' ) }
						value={ buttonUrl }
						onChange={ ( value ) =>
							setAttributes( { buttonUrl: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div className="gtb-pricing">
				{ featured && (
					<div className="gtb-pricing__featured">
						{ __( 'Featured', 'gutenblocks' ) }
					</div>
				) }
				<div className="gtb-pricing__info">
					<h3 className="gtb-pricing__title">{ title }</h3>
					<p className="gtb-pricing__subtitle">{ subtitle }</p>
					<div className="gtb-pricing__price-wrapper">
						{ onSale ? (
							<span className="gtb-pricing__price">
								<del>
									{ currency }
									{ price }
								</del>{ ' ' }
								{ currency }
								{ salePrice }
							</span>
						) : (
							<span className="gtb-pricing__price">
								{ currency }
								{ price }
							</span>
						) }
						{ priceSeparator }
						<span>{ pricePeriod }</span>
					</div>
				</div>
				<ul className="gtb-pricing__features">
					{ features.map( ( feature, index ) => (
						<li key={ index }>{ feature.text }</li>
					) ) }
				</ul>
				<div className="gtb-pricing__button">
					<a href={ buttonUrl } className="gtb-pricing__button-link">
						{ buttonText }
					</a>
				</div>
			</div>
		</div>
	);
};

export default Edit;
