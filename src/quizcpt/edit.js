import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, L } from '@wordpress/components';

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title="MCQ Settings">
					<TextControl
						label="Question"
						__nextHasNoMarginBottom={true}
					/>
				</PanelBody>
			</InspectorControls>
			<div>
				<div>
					<h2>Quiz Settings</h2>
					<TextControl
						label="Quiz Name"
						__nextHasNoMarginBottom={true}
					/>
				</div>
			</div>
		</div>
	);
}
