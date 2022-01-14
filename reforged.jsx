#target photoshop

var dlg = new Window("dialog", "Reforged Textures Converter", {x:0, y:0, width:600, height:160} ,{closeButton: true});
savePsd = false;
dlg.center();
//var dlg = dlg.add('panel', {x:20, y:20, width: 560, height: 115}, 'Select Input Folder');
PathInHint = dlg.add('statictext', {x:15, y:20, width:70,height:25} ,'Input Folder:');
PathOutHint = dlg.add('statictext', {x:15, y:50, width:70,height:25} ,'Output Folder:');
PathIn = dlg.add('edittext', {x:90, y:20, width:400,height:25} ,'');
PathOut = dlg.add('edittext', {x:90, y:50, width:400,height:25} ,'');
btn_inputFolder = dlg.add('button',{x:495, y:20, width:50,height:25},'...');  
btn_outputFolder = dlg.add('button',{x:495, y:50, width:50,height:25},'...');  

CkeckAdd = dlg.add('checkbox',{x:15, y:80, width:93,height:25},'Generate PSDs'); 
btn_import = dlg.add('button',{x:15, y:110, width:207,height:25},'Convert'); 

CkeckAdd.onClick = function (){  
if(this.value){  
    savePsd = true;
    }  
else{  
    savePsd = false;
    }  
} 

btn_inputFolder.onClick = function(){    
	var inputFolder = Folder.selectDialog("Select an input folder");
	if(inputFolder!=null){PathIn.text = inputFolder.fsName}; 
}; 
btn_outputFolder.onClick = function(){   
	var outputFolder = Folder.selectDialog("Select an output folder");
	if(outputFolder!=null){PathOut.text = outputFolder.fsName};
}; 

btn_import.onClick = function(){  
  dlg.close();
  runthis();
};

dlg.show();

function runthis()
{
	var cWhite = new SolidColor();  
		cWhite.rgb.red = 255;  
		cWhite.rgb.green = 255;  
		cWhite.rgb.blue = 255;  
		
	var cBlack = new SolidColor();  
		cBlack.rgb.red = 0;  
		cBlack.rgb.green = 0;  
		cBlack.rgb.blue = 0;
		
    var path = PathIn.text;
	var path2 = PathOut.text;

    var inputFolder = new Folder(path);
	var outputFolder = new Folder(path2);
	
	var inputFiles = inputFolder.getFiles("*_diffuse.dds");
	
    for(index in inputFiles)
    {
		var ModelName = GetFileName(String(inputFiles[index])).replace("_diffuse","");
		inputFiles[index] = inputFiles[index].toString().replace("_diffuse.dds","");

		opendds(inputFiles[index] + "_diffuse.dds");
		var wc3_diffuse = app.activeDocument;
		app.activeDocument.activeLayer.name = 'Layer 0';
		var lBck =  app.activeDocument.activeLayer;

		opendds(inputFiles[index] + "_orm.dds");
		
		var wc3_orm = app.activeDocument;

		opendds(inputFiles[index] + "_normal.dds");
		var wc3_normal = app.activeDocument;
		
		fileToOpen = null;
        file = null;

		//---EDIT _NORM---//
		
		app.activeDocument = wc3_normal;
				
		app.activeDocument.channels[0].duplicate(); 
		app.activeDocument.channels.getByName('Red copy').name = 'Alpha 1';
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[0]];
		activeDocument.selection.fill(cWhite);
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[1]];
		app.activeDocument.activeLayer.invert();
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[2]];
		activeDocument.selection.fill(cBlack);
		
		savedds(File(path2 + "/" + ModelName + "_norm.dds"));
		
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		
		//--- NORM SAVED ---//
		
		//---Collect Layers---//
		app.activeDocument = wc3_diffuse;
		
		//app.activeDocument.layers[0].layer.name = 'Layer 0';
		app.activeDocument.artLayers.add();
		var lB = app.activeDocument.activeLayer;
		app.activeDocument.artLayers.add();
		var lA = app.activeDocument.activeLayer;
		app.activeDocument.artLayers.add();
		var lGi = app.activeDocument.activeLayer;
		app.activeDocument.artLayers.add();
		var lR = app.activeDocument.activeLayer;
		app.activeDocument.artLayers.add();
		var lmask = app.activeDocument.activeLayer;
		app.activeDocument.artLayers.add();
		var lteamcolor = app.activeDocument.activeLayer;
		//app.activeDocument.activeLayer = lteamcolor;
		app.activeDocument.selection.fill(cBlack);
		
		app.activeDocument = wc3_orm;
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[2]];
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		
		app.activeDocument = wc3_diffuse;
		
		app.activeDocument.activeLayer = lB;
		app.activeDocument.paste();
		
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		
		MakeAdjLayer();
		var laMetal = app.activeDocument.activeLayer;
		SetAdjLayer( 0, 0, -20);
		SelectMask();
		app.activeDocument.paste();
		
		app.activeDocument.activeLayer = lB;
		
		MakeAdjLayer();
		var laNonMetal = app.activeDocument.activeLayer;
		SetAdjLayer( 0, -100, -25);
		SelectMask();
		app.activeDocument.paste();
		app.activeDocument.activeLayer.invert();
		
		laNonMetal.visible = false;
		
		app.activeDocument = wc3_orm;
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[3]];
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();

		app.activeDocument = wc3_diffuse;
		
		app.activeDocument.activeLayer = lA;
		app.activeDocument.paste();


		app.activeDocument = wc3_orm;
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[1]];
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();

		app.activeDocument = wc3_diffuse;
		
		app.activeDocument.activeLayer = lGi;
		app.activeDocument.paste();
		app.activeDocument.activeLayer.invert();
		
		
		app.activeDocument = wc3_orm;
		
		app.activeDocument.activeChannels = [app.activeDocument.channels[0]];
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();

		app.activeDocument = wc3_diffuse;
		
		app.activeDocument.activeLayer = lR;
		app.activeDocument.paste();

		//Close ORM, not needed anymore
		app.activeDocument = wc3_orm;
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		//
		
		app.activeDocument = wc3_diffuse;

		try 
		{ 
			app.activeDocument.activeChannels = [app.activeDocument.channels[3]];
		}
        catch(e) 
		{
			app.activeDocument.channels.add();
			app.activeDocument.activeChannels = [app.activeDocument.channels[3]];
			app.activeDocument.selection.selectAll();
			app.activeDocument.activeLayer.invert();
        }
		finally
		{
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		}
		
		app.activeDocument.activeLayer = lmask;
		app.activeDocument.paste();
		
		//hide
		
		lmask.visible = false;
		lteamcolor.visible = false;
		lR.visible = false;
		lGi.visible = false;
		lA.visible = true;
		lB.visible = false;
		
		app.activeDocument.activeLayer = lA;

		try 
		{ 
			selectColorRange(
				RGBc(0.0, 0.0, 0.0),
				RGBc(19.0, 19.0, 19.0)
			);

			//app.activeDocument.selection.invert();
			executeAction(charIDToTypeID('Invs'), undefined, DialogModes.NO);
			activeDocument.selection.bounds;
			
			lA.visible = false;
			lBck.visible = true;
			app.activeDocument.activeLayer = lBck;
			app.activeDocument.selection.copy();
			app.activeDocument.activeLayer = lteamcolor;
			lteamcolor.visible = true;
			app.activeDocument.paste();
			app.activeDocument.activeLayer.merge();
			app.activeDocument.activeLayer.invert();
			lteamcolor = app.activeDocument.activeLayer;
		}
        catch(e) 
		{
			app.activeDocument.activeLayer = lteamcolor;
			lteamcolor.visible = true;
			app.activeDocument.activeLayer.invert();
        }
		finally
		{
			lA.visible = false;
			lteamcolor.visible = false;
		}
		
		// DIFF

		app.activeDocument.activeLayer = lteamcolor;
		lteamcolor.visible = true;
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();

		app.activeDocument.activeLayer = lBck;
		app.activeDocument.activeChannels = [app.activeDocument.channels[3]];
		app.activeDocument.paste();
		
		lteamcolor.visible = false;
		
		if (savePsd == true)
		{
			var psdOptions = new PhotoshopSaveOptions();
			psdOptions.alphaChannels = true;
			psdOptions.annotations = false;
			psdOptions.embedColorProfile = false;
			psdOptions.layers = true;
			psdOptions.spotColors = false;
		
			var psdfile = new File(path2 + "/" + ModelName);
			app.activeDocument.saveAs(psdfile, psdOptions, true);
		}

		// END DIFF
		
		savedds(File(path2 + "/" + ModelName + "_diff.dds"));
		
		// SPEC
		
		//alpha setup			
		lGi.visible = true;
		app.activeDocument.activeLayer = lGi;
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		app.activeDocument.activeChannels = [app.activeDocument.channels[3]];
		app.activeDocument.paste();
		//end Alpha
		
		lGi.visible = false;
		lBck.visible = true;
		
		app.activeDocument.activeLayer = laMetal;
		SetAdjLayer( -15, 0, 0);

		app.activeDocument.activeLayer = laNonMetal;
		SetAdjLayer( 0, -100, -25);
		laNonMetal.visible = true;
		
		// END SPEC
		
		savedds(File(path2 + "/" + ModelName + "_spec.dds"));
		
		// MASK_GLOSS
		
		lBck.visible = false;
		lB.visible = false;
		lA.visible = false;
		lR.visible = false;
		lGi.visible = true;

		laMetal.visible = false;
		laNonMetal.visible = false;
		
		app.activeDocument.activeLayer = lmask;
		lmask.visible = true;
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		lmask.visible = false;
		
		app.activeDocument.activeLayer = lBck;
		lBck.visible = true;
		app.activeDocument.activeChannels = [app.activeDocument.channels[0]];
		app.activeDocument.paste();
		lBck.visible = false;

		app.activeDocument.activeLayer = lGi;
		lGi.visible = true;
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		lGi.visible = false;
		
		app.activeDocument.activeLayer = lBck;
		lBck.visible = true;
		app.activeDocument.activeChannels = [app.activeDocument.channels[1]];
		app.activeDocument.paste();
		lBck.visible = false;
		
		app.activeDocument.activeLayer = lR;
		lR.visible = true;
		app.activeDocument.selection.selectAll();
		app.activeDocument.selection.copy();
		lR.visible = false;
		
		app.activeDocument.activeLayer = lBck;
		lBck.visible = true;
		app.activeDocument.activeChannels = [app.activeDocument.channels[2]];
		app.activeDocument.paste();	
		
		app.activeDocument.channels[3].remove();
		
		// END MASK_GLOSS

		savedds(File(path2 + "/" + ModelName + "_mask_gloss_ao.dds"));

		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		$.sleep(1000)
    }
    // dispose
    inputFolder = null;
    inputFiles = null;

}

/******* Support functions *******/

function GetFileName(fullPath)
{
    var m = fullPath.match(/(.*)[\/\\]([^\/\\]+)\.\w+$/);
    return m[2];
}

function cTID(s) { return app.charIDToTypeID(s); }
function sTID(s) { return app.stringIDToTypeID(s); }

function RGBc(r, g, b) {
    var color = new ActionDescriptor();
        color.putDouble( cTID("Rd  "), r);
        color.putDouble( cTID("Grn "), g);
        color.putDouble( cTID("Bl  "), b);   
    return color
}

function selectColorRange(color1, color2){
    var desc = new ActionDescriptor(); 
    desc.putInteger(cTID("Fzns"), 0 ); 
    desc.putObject( cTID("Mnm "), cTID("RGBC"), color1 ); 
    desc.putObject( cTID("Mxm "), cTID("RGBC"), color2 ); 
    executeAction( cTID("ClrR"), desc, DialogModes.NO );
}

/******* Low-level functions *******/

function savedds(ddspath)
{
	var ddsformat = "BC3";
	var idsave = charIDToTypeID( "save" );
	var desc135 = new ActionDescriptor();
	var idAs = charIDToTypeID( "As  " );
	var desc136 = new ActionDescriptor();
	var idpres = charIDToTypeID( "pres" );
	desc136.putString( idpres, ddsformat );
	var idIn = charIDToTypeID( "In  " );
	desc135.putPath( idIn, new File( ddspath ) );
	var idDocI = charIDToTypeID( "DocI" );
	desc135.putInteger( idDocI, 1767 );
	var idCpy = charIDToTypeID( "Cpy " );
	desc135.putBoolean( idCpy, true );
	executeAction( idsave, desc135, DialogModes.NO );
}

function opendds(ddspath2)
{
	var idOpn = charIDToTypeID( "Opn " );
	var desc6 = new ActionDescriptor();
	var iddontRecord = stringIDToTypeID( "dontRecord" );
	desc6.putBoolean( iddontRecord, false );
	var idforceNotify = stringIDToTypeID( "forceNotify" );
	desc6.putBoolean( idforceNotify, true );
	var idnull = charIDToTypeID( "null" );
	desc6.putPath( idnull, new File( ddspath2 ) );
	var idAs = charIDToTypeID( "As  " );
	var desc7 = new ActionDescriptor();
	var idmipm = charIDToTypeID( "mipm" );
	desc7.putBoolean( idmipm, false );
	var idalps = charIDToTypeID( "alps" );
	desc7.putBoolean( idalps, true );
	var idIntelTextureWorksIntelTextureWorks = stringIDToTypeID( "Intel® Texture Works Intel® Texture Works" );
    desc6.putObject( idAs, idIntelTextureWorksIntelTextureWorks, desc7 );
	var idDocI = charIDToTypeID( "DocI" );
	desc6.putInteger( idDocI, 220 );
	executeAction( idOpn, desc6, DialogModes.NO );
}

function SelectMask()
{	
	var idShw = charIDToTypeID( "Shw " );
    var desc410 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var list134 = new ActionList();
	var ref235 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idOrdn = charIDToTypeID( "Ordn" );
	var idTrgt = charIDToTypeID( "Trgt" );
	ref235.putEnumerated( idChnl, idOrdn, idTrgt );
	list134.putReference( ref235 );
    desc410.putList( idnull, list134 );
	executeAction( idShw, desc410, DialogModes.NO );

	var idHd = charIDToTypeID( "Hd  " );
	var desc411 = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var list135 = new ActionList();
	var ref236 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idChnl = charIDToTypeID( "Chnl" );
	var idRd = charIDToTypeID( "Rd  " );
	ref236.putEnumerated( idChnl, idChnl, idRd );
	list135.putReference( ref236 );
	var ref237 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idChnl = charIDToTypeID( "Chnl" );
	var idGrn = charIDToTypeID( "Grn " );
	ref237.putEnumerated( idChnl, idChnl, idGrn );
	list135.putReference( ref237 );
	var ref238 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idChnl = charIDToTypeID( "Chnl" );
	var idBl = charIDToTypeID( "Bl  " );
	ref238.putEnumerated( idChnl, idChnl, idBl );
	list135.putReference( ref238 );
	desc411.putList( idnull, list135 );
	executeAction( idHd, desc411, DialogModes.NO );
}	

function MakeAdjLayer()
{
	var idMk = charIDToTypeID( "Mk  " );
    var desc7 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
	var ref1 = new ActionReference();
	var idAdjL = charIDToTypeID( "AdjL" );
	ref1.putClass( idAdjL );
    desc7.putReference( idnull, ref1 );
    var idUsng = charIDToTypeID( "Usng" );
	var desc8 = new ActionDescriptor();
	var idType = charIDToTypeID( "Type" );
	var desc9 = new ActionDescriptor();
	var idpresetKind = stringIDToTypeID( "presetKind" );
	var idpresetKindType = stringIDToTypeID( "presetKindType" );
	var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
	desc9.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
	var idClrz = charIDToTypeID( "Clrz" );
	desc9.putBoolean( idClrz, false );
	var idHStr = charIDToTypeID( "HStr" );
	desc8.putObject( idType, idHStr, desc9 );
    var idAdjL = charIDToTypeID( "AdjL" );
    desc7.putObject( idUsng, idAdjL, desc8 );
	executeAction( idMk, desc7, DialogModes.NO );
}

function SetAdjLayer( iHue, iSat, iLgh)
{	
	var idsetd = charIDToTypeID( "setd" );
    var desc10 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
	var ref2 = new ActionReference();
	var idAdjL = charIDToTypeID( "AdjL" );
	var idOrdn = charIDToTypeID( "Ordn" );
	var idTrgt = charIDToTypeID( "Trgt" );
	ref2.putEnumerated( idAdjL, idOrdn, idTrgt );
    desc10.putReference( idnull, ref2 );
    var idT = charIDToTypeID( "T   " );
	var desc11 = new ActionDescriptor();
	var idpresetKind = stringIDToTypeID( "presetKind" );
	var idpresetKindType = stringIDToTypeID( "presetKindType" );
	var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
	desc11.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
	var idAdjs = charIDToTypeID( "Adjs" );
	var list1 = new ActionList();
	var desc12 = new ActionDescriptor();
	var idH = charIDToTypeID( "H   " );
	desc12.putInteger( idH, iHue );
	var idStrt = charIDToTypeID( "Strt" );
	desc12.putInteger( idStrt, iSat );
	var idLght = charIDToTypeID( "Lght" );
	desc12.putInteger( idLght, iLgh );
	var idHsttwo = charIDToTypeID( "Hst2" );
	list1.putObject( idHsttwo, desc12 );
	desc11.putList( idAdjs, list1 );
    var idHStr = charIDToTypeID( "HStr" );
    desc10.putObject( idT, idHStr, desc11 );
	executeAction( idsetd, desc10, DialogModes.NO );	
}