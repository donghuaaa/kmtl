// <!--GAMFC-->version base on commit 841ed4e9ff121dde0ed6a56ae800c2e6c4f66056, time is 2024-04-16 18:02:37 UTC<!--GAMFC-END-->.
// @ts-ignore
import { connect } from 'cloudflare:sockets';

const listProxy = [
    { path: '/id1', proxy: '194.58.56.169' },
    { path: '/id2', proxy: '202.10.42.30' },
    { path: '/id3', proxy: '104.99.186.73' },
    { path: '/id4', proxy: '104.106.206.73' },
    { path: '/id5', proxy: '35.219.50.99' },
    { path: '/sg1', proxy: '210.87.110.230' },
    { path: '/sg2', proxy: '188.166.255.195' },
    { path: '/sg3', proxy: '103.65.36.174' },
    { path: '/sg4', proxy: '194.36.179.237' },
    { path: '/sg5', proxy: '8.219.111.175' },
    { path: '/my1', proxy: '23.37.81.73' },
    { path: '/jp1', proxy: '43.153.181.217' },
    //tambahin sendiri
];
let proxyIP;
export default {
    async fetch(request, ctx) {
        try {
            proxyIP = proxyIP;
            const url = new URL(request.url);
            const upgradeHeader = request.headers.get('Upgrade');
            for (const entry of listProxy) {
                if (url.pathname === entry.path) {
                    proxyIP = entry.proxy;
                    break;
                }
            }
            if (upgradeHeader === 'websocket' && proxyIP) {
                return await vlessOverWSHandler(request);
            }
            const allConfig = await getAllConfigVless(request.headers.get('Host'));
            return new Response(allConfig, {
                status: 200,
                headers: { "Content-Type": "text/html;charset=utf-8" },
            });
        } catch (err) {
            return new Response(err.toString(), { status: 500 });
        }
    },
};
async function getAllConfigVless(hostName) {
    try {
        let allConfigs = '';
        for (const entry of listProxy) {
            const { path, proxy } = entry;
            const response = await fetch(`https://ipwhois.app/json/${proxy}`);
            const data = await response.json();
            const pathFixed = encodeURIComponent(path);
            const vlessTls = `vless://bexnxx\u0040${hostName}:443?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=${pathFixed}#${data.isp} (${data.country_code})`;
            const vlessNtls = `vless://bexnxx\u0040${hostName}:80?path=${pathFixed}&security=none&encryption=none&host=${hostName}&fp=randomized&type=ws&sni=${hostName}#${data.isp} (${data.country_code})`;
            const vlessTlsFixed = vlessTls.replace(/ /g, '+');
            const vlessNtlsFixed = vlessNtls.replace(/ /g, '+');
            const configId = `config-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for each config block

            allConfigs += 
`<div class="config-block">
    <h2>${data.country}</h2>
    <p><strong>ISP:</strong> ${data.isp}</p>
    <p><strong>PATH:</strong> ${path}</p>
    <button class="button toggle-button" onclick="toggleConfig('${configId}')">Show Config</button>
    <div id="${configId}" class="config-details" style="display: none;">
        <div class="config-section">
            <h3>TLS:</h3>
            <p class="config-text">${vlessTlsFixed}</p>
            <button class="button" onclick='copyToClipboard("${vlessTlsFixed}")'><i class="fa fa-clipboard"></i> Copy</button>
        </div>
        <div class="config-section">
            <h3>NTLS:</h3>
            <p class="config-text">${vlessNtlsFixed}</p>
            <button class="button" onclick='copyToClipboard("${vlessNtlsFixed}")'><i class="fa fa-clipboard"></i> Copy</button>
        </div>
    </div>
</div>
<hr>`;
        }

        const htmlConfigs = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VLESS CLOUDFLARE</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #f8f8f8;
            background-color: #1b1b1b;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .config-block {
            background-color: #2e2e2e;
            border: 1px solid #3c3c3c;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .config-section {
            margin-top: 10px;
        }
        .config-text {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        h2, h3 {
            margin: 0;
            color: #00b4d8;
        }
        p {
            margin: 5px 0;
            color: #e0e0e0;
        }
        .button {
            background-color: #00b4d8;
            color: white;
            border: none;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #0092b3;
        }
        .button i {
            margin-right: 5px;
        }
        .toggle-button {
            margin-bottom: 10px;
        }
        hr {
            border: 0;
            border-top: 1px solid #444;
            margin: 20px 0;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            color: #00b4d8;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>⚡ FREE VLESS ⚡</h1>
    ${allConfigs}
    <script>
        function toggleConfig(id) {
            const configElement = document.getElementById(id);
            const button = document.querySelector(\`button[onclick="toggleConfig('\${id}')"]\`);
            if (configElement.style.display === "none") {
                configElement.style.display = "block";
                button.textContent = "Hide Config";
            } else {
                configElement.style.display = "none";
                button.textContent = "Show Config";
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert("Copied to clipboard");
                })
                .catch((err) => {
                    console.error("Failed to copy to clipboard:", err);
                });
        }
    </script>
</body>
</html>`;

        return htmlConfigs;
    } catch (error) {
        return "An error occurred while generating the VLESS configurations.";
    }
}

async function vlessOverWSHandler(request) {
	const webSocketPair = new WebSocketPair();
	const [client, webSocket] = Object.values(webSocketPair);

	webSocket.accept();

	let address = '';
	let portWithRandomLog = '';
	const log = (info, event) => {
		console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
	};
	const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

	const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

	let remoteSocketWapper = {
		value: null,
	};
	let udpStreamWrite = null;
	let isDns = false;

	readableWebSocketStream.pipeTo(new WritableStream({
		async write(chunk, controller) {
			if (isDns && udpStreamWrite) {
				return udpStreamWrite(chunk);
			}
			if (remoteSocketWapper.value) {
				const writer = remoteSocketWapper.value.writable.getWriter()
				await writer.write(chunk);
				writer.releaseLock();
				return;
			}

			const {
				hasError,
				message,
				portRemote = 443,
				addressRemote = '',
				rawDataIndex,
				vlessVersion = new Uint8Array([0, 0]),
				isUDP,
			} = processVlessHeader(chunk);
			address = addressRemote;
			portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '
				} `;
			if (hasError) {
				throw new Error(message); 
				return;
			}
			if (isUDP) {
				if (portRemote === 53) {
					isDns = true;
				} else {
					throw new Error('UDP proxy only enable for DNS which is port 53');
					return;
				}
			}
			const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0]);
			const rawClientData = chunk.slice(rawDataIndex);

			if (isDns) {
				const { write } = await handleUDPOutBound(webSocket, vlessResponseHeader, log);
				udpStreamWrite = write;
				udpStreamWrite(rawClientData);
				return;
			}
			handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log);
		},
		close() {
			log(`readableWebSocketStream is close`);
		},
		abort(reason) {
			log(`readableWebSocketStream is abort`, JSON.stringify(reason));
		},
	})).catch((err) => {
		log('readableWebSocketStream pipeTo error', err);
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, vlessResponseHeader, log,) {
	async function connectAndWrite(address, port) {
		const tcpSocket = connect({
			hostname: address,
			port: port,
		});
		remoteSocket.value = tcpSocket;
		log(`connected to ${address}:${port}`);
		const writer = tcpSocket.writable.getWriter();
		await writer.write(rawClientData);
		writer.releaseLock();
		return tcpSocket;
	}

	async function retry() {
		const tcpSocket = await connectAndWrite(proxyIP || addressRemote, portRemote)
		tcpSocket.closed.catch(error => {
			console.log('retry tcpSocket closed error', error);
		}).finally(() => {
			safeCloseWebSocket(webSocket);
		})
		remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log);
	}

	const tcpSocket = await connectAndWrite(addressRemote, portRemote);

	remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, retry, log);
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
	let readableStreamCancel = false;
	const stream = new ReadableStream({
		start(controller) {
			webSocketServer.addEventListener('message', (event) => {
				if (readableStreamCancel) {
					return;
				}
				const message = event.data;
				controller.enqueue(message);
			});
			webSocketServer.addEventListener('close', () => {
				safeCloseWebSocket(webSocketServer);
				if (readableStreamCancel) {
					return;
				}
				controller.close();
			}
			);
			webSocketServer.addEventListener('error', (err) => {
				log('webSocketServer has error');
				controller.error(err);
			}
			);
			const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
			if (error) {
				controller.error(error);
			} else if (earlyData) {
				controller.enqueue(earlyData);
			}
		},

		pull(controller) {
		},
		cancel(reason) {
			if (readableStreamCancel) {
				return;
			}
			log(`ReadableStream was canceled, due to ${reason}`)
			readableStreamCancel = true;
			safeCloseWebSocket(webSocketServer);
		}
	});

	return stream;

}
function processVlessHeader(
	vlessBuffer
) {
	if (vlessBuffer.byteLength < 24) {
		return {
			hasError: true,
			message: 'invalid data',
		};
	}
	const version = new Uint8Array(vlessBuffer.slice(0, 1));
	let isValidUser = true;
	let isUDP = false;
	if (!isValidUser) {
		return {
			hasError: true,
			message: 'invalid user',
		};
	}

	const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];

	const command = new Uint8Array(
		vlessBuffer.slice(18 + optLength, 18 + optLength + 1)
	)[0];
	if (command === 1) {
	} else if (command === 2) {
		isUDP = true;
	} else {
		return {
			hasError: true,
			message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
		};
	}
	const portIndex = 18 + optLength + 1;
	const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
	const portRemote = new DataView(portBuffer).getUint16(0);

	let addressIndex = portIndex + 2;
	const addressBuffer = new Uint8Array(
		vlessBuffer.slice(addressIndex, addressIndex + 1)
	);

	const addressType = addressBuffer[0];
	let addressLength = 0;
	let addressValueIndex = addressIndex + 1;
	let addressValue = '';
	switch (addressType) {
		case 1:
			addressLength = 4;
			addressValue = new Uint8Array(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			).join('.');
			break;
		case 2:
			addressLength = new Uint8Array(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + 1)
			)[0];
			addressValueIndex += 1;
			addressValue = new TextDecoder().decode(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			break;
		case 3:
			addressLength = 16;
			const dataView = new DataView(
				vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				ipv6.push(dataView.getUint16(i * 2).toString(16));
			}
			addressValue = ipv6.join(':');
			break;
		default:
			return {
				hasError: true,
				message: `invild  addressType is ${addressType}`,
			};
	}
	if (!addressValue) {
		return {
			hasError: true,
			message: `addressValue is empty, addressType is ${addressType}`,
		};
	}

	return {
		hasError: false,
		addressRemote: addressValue,
		addressType,
		portRemote,
		rawDataIndex: addressValueIndex + addressLength,
		vlessVersion: version,
		isUDP,
	};
}

async function remoteSocketToWS(remoteSocket, webSocket, vlessResponseHeader, retry, log) {
	let remoteChunkCount = 0;
	let chunks = [];
	let vlessHeader = vlessResponseHeader;
	let hasIncomingData = false;
	await remoteSocket.readable
		.pipeTo(
			new WritableStream({
				start() {
				},
				async write(chunk, controller) {
					hasIncomingData = true;
					if (webSocket.readyState !== WS_READY_STATE_OPEN) {
						controller.error(
							'webSocket.readyState is not open, maybe close'
						);
					}
					if (vlessHeader) {
						webSocket.send(await new Blob([vlessHeader, chunk]).arrayBuffer());
						vlessHeader = null;
					} else {
						webSocket.send(chunk);
					}
				},
				close() {
					log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
				},
				abort(reason) {
					console.error(`remoteConnection!.readable abort`, reason);
				},
			})
		)
		.catch((error) => {
			console.error(
				`remoteSocketToWS has exception `,
				error.stack || error
			);
			safeCloseWebSocket(webSocket);
		});
	if (hasIncomingData === false && retry) {
		log(`retry`)
		retry();
	}
}

function base64ToArrayBuffer(base64Str) {
	if (!base64Str) {
		return { error: null };
	}
	try {
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
		const decode = atob(base64Str);
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		return { error };
	}
}


const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
function safeCloseWebSocket(socket) {
	try {
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		console.error('safeCloseWebSocket error', error);
	}
}

async function handleUDPOutBound(webSocket, vlessResponseHeader, log) {

	let isVlessHeaderSent = false;
	const transformStream = new TransformStream({
		start(controller) {

		},
		transform(chunk, controller) {
			for (let index = 0; index < chunk.byteLength;) {
				const lengthBuffer = chunk.slice(index, index + 2);
				const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
				const udpData = new Uint8Array(
					chunk.slice(index + 2, index + 2 + udpPakcetLength)
				);
				index = index + 2 + udpPakcetLength;
				controller.enqueue(udpData);
			}
		},
		flush(controller) {
		}
	});
	transformStream.readable.pipeTo(new WritableStream({
		async write(chunk) {
			const resp = await fetch('https://1.1.1.1/dns-query',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/dns-message',
					},
					body: chunk,
				})
			const dnsQueryResult = await resp.arrayBuffer();
			const udpSize = dnsQueryResult.byteLength;
			const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
			if (webSocket.readyState === WS_READY_STATE_OPEN) {
				log(`doh success and dns message length is ${udpSize}`);
				if (isVlessHeaderSent) {
					webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
				} else {
					webSocket.send(await new Blob([vlessResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
					isVlessHeaderSent = true;
				}
			}
		}
	})).catch((error) => {
		log('dns udp has error' + error)
	});

	const writer = transformStream.writable.getWriter();

	return {
		write(chunk) {
			writer.write(chunk);
		}
	};
}