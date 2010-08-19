
jQuery.fn.extend({
	color: function(array, css_attribute) {
		css_attribute = css_attribute || "background-color"
		if ( array==null ){
			var color_val =  this.eq(0).css(css_attribute);
			var colors = new Array();
			color_val=color_val.replace("(","");
			color_val=color_val.replace(")","");
			color_val=color_val.replace("rgb","");
			colors = color_val.split(",");
			for (var i in colors){
				colors[i]=parseInt(colors[i]);
			} 
			return colors;
		}
		else{
			for (var i in array){
				array[i]=(parseInt(array[i])).toString(16,2);
				if(array[i].length==1){ array[i]="0"+array[i]; }
			} 
			var color_val="#"+array.join("");
			return this.css({css_attribute:color_val});
		}
	},
	colorTransform: function(string){
		var defaultHue=0.2;
		var instructions = string.split(/\s+/);
		var operation = instructions[0];
		var args = instructions.slice(1);
		var old = this.color();
		var cols=new col(old[0],old[1],old[2]);
		if (operation=="scaleAmp"){cols.scaleAmp(args[0]);}
		else if (operation=="setAmp"){cols.setAmp(args[0]);}
		else if (operation=="setAngles"){cols.setAngles(args[0],args[1]);}
		else if (operation=="scaleAngles"){cols.scaleAngles(args[0],args[1]);}
		else if (operation=="greyscale"){
			var hsl = cols.toHSL();
			hsl[1]=0; 
			var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
			cols.red=rgb[0];
			cols.green=rgb[1];
			cols.blue=rgb[2];
		}
		else if (operation=="colorize"){
			var hsl = cols.toHSL();
			hsl[1]=1; 
			hsl[0]=args[0]; 
			var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
			cols.red=rgb[0];
			cols.green=rgb[1];
			cols.blue=rgb[2];
		}
		 else if (operation=="darken"){
			var hsl = cols.toHSL();
			hsl[2]=args[0]; 
			var rgb = cols.HSLtoRGB(hsl[0],hsl[1],hsl[2]);
			cols.red=rgb[0];
			cols.green=rgb[1];
			cols.blue=rgb[2];
		}
		else if (operation=="setHSL"){
			var rgb = cols.HSLtoRGB(args[0],args[1],args[2]);
			cols.red=rgb[0];
			cols.green=rgb[1];
			cols.blue=rgb[2];
		}
		return this.color(cols.vector());
		}
});

function col(r,g,b){
	phi_grey = 0.785;
	theta_grey = 0.615;
	this.rgb = [r,g,b];
	this.red = r;
	this.green = g;
	this.blue = b;
	this.det = Math.pow(this.red,2) + Math.pow(this.green,2) + Math.pow(this.blue,2);
	this.det2 = Math.pow(this.red,2)+Math.pow(this.blue,2);
	this.rg = Math.pow(this.det2,0.5);
	this.theta = Math.atan2(this.green,this.rg);
	this.phi = Math.atan2(this.blue,this.red);
	this.amp = Math.pow(this.det, 0.5);
	
	this.scaleAmp = function(amount){
		this.amp*=amount;
		this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
		this.green = this.amp*Math.sin(this.theta);
		this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
	}
	
	this.setAmp = function(new_amp){
		this.amp=new_amp;
		this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
		this.green = this.amp*Math.sin(this.theta);
		this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
	}
	
	this.setAngles = function(phi,theta){
		this.phi = phi;
		this.theta = theta;
		this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
		this.green = this.amp*Math.sin(this.theta);
		this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
	}
	
	this.scaleAngles = function(phi_scale,theta_scale){
		this.phi = this.phi * phi_scale;
		this.theta = this.theta * theta_scale;
		this.red   = this.amp*Math.cos(this.theta)*Math.cos(this.phi);
		this.green = this.amp*Math.sin(this.theta);
		this.blue  = this.amp*Math.cos(this.theta)*Math.sin(this.phi);
	}
	
	this.toHex = function(){
		var red  = (parseInt(this.red)).toString(16);
		if(red.length==1){red="0"+red;}
		var green =(parseInt(this.green)).toString(16);
		if(green.length==1){green="0"+green;}
		var blue =(parseInt(this.blue)).toString(16);
		if(blue.length==1){blue="0"+blue;}
		return red+green+blue;
	}
	
	this.HuetoRGB = function(v1,v2,vH){
	 if ( vH < 0 ){vH += 1;}
	 if ( vH > 1 ){vH -= 1;}
	 if (( 6 * vH ) < 1 ){ return ( v1 + ( v2 - v1 ) * 6 * vH );}
	 else if (( 2 * vH ) < 1 ){ return ( v2 );}
	 else if (( 3 * vH ) < 2 ){ return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );}
	 else {return v1};
	 }
	
	this.HSLtoRGB=function(hue,sat,lum){
		hue=parseFloat(hue);
		sat=parseFloat(sat);
		lum=parseFloat(lum);
		var var_1=0;
		var var_2=0;
		var output=new Array();
		if ( sat == 0 ){
			output[0] = lum * 255;
			output[1] =  lum * 255;
			output[2] =  lum * 255;
		}
		else{
			if ( lum < 0.5 ) {var_2 = lum * (1 + sat);}
			else {var_2 = (lum + sat) - (sat * lum);}
			var_1 = 2 * lum - var_2;
			output[0] = 255 * this.HuetoRGB(var_1, var_2,hue + ( 1 / 3 ) );
			this.red=output[0];
			output[1] = 255 * this.HuetoRGB(var_1, var_2,hue);
			this.green=output[1];
			output[2] = 255 * this.HuetoRGB(var_1, var_2,hue - ( 1 / 3 ) );
			this.blue=output[2];
	 };
	return output;
	}
	this.toHSL = function(){
		var var_R = (this.red / 255 );
		var var_G = (this.green / 255 );
		var var_B = (this.blue / 255 );
		
		var var_Min = Math.min(var_B,Math.min(var_R,var_G));
		var var_Max = Math.max(Math.max(var_R,var_G,var_B));
		var del_Max = var_Max - var_Min;
		var L = (var_Max + var_Min ) / 2;
		if ( del_Max == 0 ){
			var H = 0;
			var S = 0;
		}
		else{
			if ( L < 0.5 ){var S = del_Max / ( var_Max + var_Min );}
			else {var S = del_Max / ( 2 - var_Max - var_Min );}
			var del_R = ((( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
			var del_G = ((( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
			var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

			if ( var_R == var_Max ){ var H = del_B - del_G;}
			else if ( var_G == var_Max ){ var H = ( 1 / 3 ) + del_R - del_B;}
			else if ( var_B == var_Max ){ var H = ( 2 / 3 ) + del_G - del_R;}
			if ( H < 0 ) { H += 1;}
			if ( H > 1 ) { H -= 1;}
		}
		var output = new Array();
		output[0] = this.hue = H;
		output[1] = this.sat = S;
		output[2] = this.lum = L;
		return output;
	}

	this.invert = function(){
		this.red=255-this.red;
		this.green=255-this.green;
		this.blue=255-this.blue;
	}
	this.vector = function(){
		var output = new Array();
		output[0] = parseInt(this.red);
		output[1] = parseInt(this.green);
		output[2] = parseInt(this.blue);
		return output;
	}
	this.shiftHue = function(){
		var output = new Array();
		output[0] = parseInt(this.red);
		output[1] = parseInt(this.green);
		output[2] = parseInt(this.blue);
		return output;
	}
	this.max = function(){
		var mx = new Object();
		mx.val = 0;
		for (var i=0;i<this.vector().length;i++){
			if (this.vector()[i]>mx.val){mx.val=this.vector()[i];mx.index=i;}
		}
		return mx;
	}
	
	this.min = function(){
		var mn = new Object();
		mn.val = 0;
		for (var i=0;i<this.vector().length;i++){
			if (this.vector()[i]<mn.val){mn.val=this.vector()[i];mn.index=i;}
		}
		return mn;
	}
	this.normalize = function(to){
		to = to || 255;
		var norm = new Array();
		for ( var i = 0; i < this.vector().length; i++ ){
			norm[i] = (this.vector()[i] / this.max().val) * to;
		}
		return norm;
	}
	
	this.constrain = function(min,max){
		min = min || 0;
		max = max || 255;
		var con = new Array();
		for (var i=0; i < this.vector().length; i++){
			if ( this.vector()[i] < min ){ con[i] = min; }
			else if ( this.vector()[i] > max ){ con[i]=max; }
			else{ con[i] = this.vector()[i]; }
		}
		return con;
	}
	
	this.validate = function(){
		return this.constrain();
	}
}
