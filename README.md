DA UPX PROJEKTO!

Keks_Und_Lols tem meme.
Cunny.html é meme.

Começa pelo Basicus.html.

StartZ apenas existe para caso de emergencia, é inutil.

Linha 40 do login.html pula a verificação do banco, comente ela para usá-lo.

Linha 43 do motor1.html usa banco, comente para pulá-lo.

Linha 952, 953 e 954 do SiteDesu.html usa banco, comente para pulá-lo.

Para usar banco no SiteDesu.html tira o comentário dos:

trocarParaMotorista();
carregarDadosCalendario();

e coloca dentro de comentário os:

document.getElementById('painelMotorista').style.display = 'block';
document.getElementById('painelPassageiro').style.display = 'none';


document.getElementById('painelMotorista').style.display = 'none';
document.getElementById('painelPassageiro').style.display = 'block';