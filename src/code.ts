/* 
	source code for text 2 curve for figma
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/
import './extra.ts';
import './curve.ts';


//convert text into indivisual characters
function text2Curve(node) {
	//convert text into each letter indivusally
	const newNodes: SceneNode[] = []
	const charArr = [...node.characters]

	let spacing = 0

	for (let i = 0; i < node.characters.length; i++) {
		const letter = figma.createText()
		letter.characters = charArr[i]

		// center the letters
		letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		//copy settings
		letter.fontSize = node.fontSize
		letter.fontName = node.fontName

		//set locations
		letter.x = node.x + spacing
		letter.y = node.y + node.height + 3

		//spaceing them
		spacing = spacing + letter.width
		//rotate

		//append that shit
		figma.currentPage.appendChild(letter)
		newNodes.push(letter)
	}
	figma.currentPage.selection = newNodes
	figma.viewport.scrollAndZoomIntoView(newNodes)
	return
}

// main code
//async required because figma api requires you to load fonts into the plugin to use them
//honestly im really tempted to just hardcode roboto instead
async function main(): Promise<string | undefined> {
	let selection = figma.currentPage.selection
	if (selection.length == 0) {
		figma.closePlugin('nothings selected dumbass')
		return
	}
	// if ( selection.length > 2 || selection.length < 2) {
	//   figma.closePlugin("you need TWO things selected can you read?");
	//   //return;
	// }
	else {
	}
	for (const node of figma.currentPage.selection) {
		if (node.type == 'VECTOR') {
			const vectors = svg2Arr(node.vectorPaths[0].data)

			// create an html svg element becasue the builtin function only works on svg files
			// so apparently you cant even init a svg path here so i have to send it to the UI HTML
			//MASSIV BrUH
			var x = node.x
			var y = node.y

			figma.ui.postMessage({ type: 'svg', vectors, x, y })

			//testdatas
			const testdata = [
				[1.388586401939392, 21.729154586791992],
				[-4.074989438056946, 2.2291507720947266],
				[6.92498779296875, -3.775749444961548],
				[28.388591766357422, 2.2291524410247803]
			]
			//var a = pointOnCurve(testdata)

			const newNodes: SceneNode[] = []
			// for (var b =0;b < a.length;b++) {

			// 	if (isNaN(a[b][0][0])) {

			// 	} else {

			// 	const test = figma.createRectangle();
			// 	test.resize(1,1);
			// 	test.y=a[b][0][0]
			// 	test.x=a[b][0][1]
			// 	test.rotation=a[b][0][2]
			// 	figma.currentPage.appendChild(test)
			// 	newNodes.push(test)

			// 	}

			// }
		}
		if (node.type == 'TEXT') {
			//the font loading part
			await figma.loadFontAsync({
				family: node.fontName['family'],
				style: node.fontName['style']
			})
			text2Curve(node)
		}
	}
}

function calcCurves(vectors, vectorLengths, x, y) {
	let pointArr = []
	for (var curve in vectors) {
		pointArr.push(...pointOnCurve(vectors[curve], 100, true))
	}
	let a = pointArr
	const newNodes: SceneNode[] = []
	for (var b = 0; b < a.length; b++) {
		if (isNaN(a[b][0][0])) {
		} else {
			const test = figma.createRectangle()
			test.resizeWithoutConstraints(0.1, 0.4)
			test.y = a[b][0][1]
			test.x = a[b][0][0]
			test.rotation = a[b][0][2]
			figma.currentPage.appendChild(test)
			newNodes.push(test)
		}
	}
	figma.flatten(newNodes)
	console.log(pointArr)
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
	if (msg.type === 'do-the-thing') {
		main()
	}
	if (msg.type === 'cancel') {
		figma.closePlugin('k')
	}
	if (msg.type === 'svg') {
		
		//turns out u dont need this oops
		//var relvect = abs2rel(msg.vectors[0], msg.x, msg.y)
		//console.log(relvect)
		calcCurves(msg.vectors, msg.vectorLengths, msg.x, msg.y)
		figma.closePlugin()
	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao. default generated tutorial headass
}
