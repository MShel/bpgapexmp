var devices = new Array();

var getDevices = function() {
	var i = 0;
	$('#devices').empty();
	$('#devices').append("<li><a class='button-secondary'>Searching...</a></li>");
		
	var discovering = window.bluetooth.startDiscovery(
		function(a)
		{
			devices[i] = a;
			i = i+1;
		},
		function(b)
		{
			updateDeviceList(devices);
			window.bluetooth.stopDiscovery();
		},
		function(c)
		{
			alert("error");
		}
)
};

function updateDeviceList(devices) {
	$('#devices').empty();
	$.each(devices,function(index,value){
		$('#devices').append("<li><a value='"+index+"'>"+value.name+"</a></li>");
	})

	$('#devices>li>a').bind('click', tryPair);
}

$(document).ready( function () {
	$('#get-discoverable-devices').bind('click', getDevicesEvent);
});

function tryConnect(device){
						window.bluetooth.connect(
									function(aa){
											alert(JSON.stringify(device));
											$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(aa));
										},
									function(bb){
											alert(JSON.stringify(device));
											$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(bb));
										},
										device
								);
}

function tryPair()
{
	var device = devices[$(this).attr("value")];
	window.bluetooth.disconnect();
	
	window.bluetooth.pair(
							function(a){
								$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(a))
								window.bluetooth.getUuids(
									function(aaaa){
										alert(JSON.stringify(aaaa));
										//$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(aaaa));
										device.uuid  = aaaa.uuids[1];
										tryConnect(device);
									},
									function(ba){
										alert(JSON.stringify(ba));
										//$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(ba))
									},
									device.address); 
								

							},
							function(b){
								$('#dbl').val();
								$('#dbl').val($('#dbl').val()+"\r\n"+ JSON.stringify(b))
							},
							device.address);
							
	$('#dbl').val($('#dbl').val() +"\r\n"+ JSON.stringify(device));
}

function getDevicesEvent() {
	getDevices(
			function(r){
				// The call has been successfully made.
				$("#get-discoverable-devices").text('Gathering devices...');
				$("#get-discoverable-devices").unbind('click');
				$("#get-discoverable-devices").addClass('no_underline');
				$("#get-discoverable-devices").removeClass('reallink');
				alert(r);
			},
			function(e)
			{
				alert(e);
			}
	);
}
