const MODO_DEMONSTRACAO = true;

const WHATSAPP_NUMERO = "5500000000000";

const EMAIL_CONTATO = "contato@estudioambar.example";

function montarLinkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

function montarLinkEmail(mensagem) {
  const assunto = encodeURIComponent("Contato pelo site");
  return `mailto:${EMAIL_CONTATO}?subject=${assunto}&body=${encodeURIComponent(mensagem)}`;
}

const elementosContato = document.querySelectorAll("[data-wa-msg], [data-email-mensagem]");
const dialogoAviso = document.getElementById("aviso-demonstracao");
let elementoQueAbriuAviso = null;

if (MODO_DEMONSTRACAO) {
  elementosContato.forEach((elemento) => {
    elemento.setAttribute("href", "#");
    elemento.addEventListener("click", (evento) => {
      evento.preventDefault();
      elementoQueAbriuAviso = elemento;
      dialogoAviso.showModal();
    });
  });

  dialogoAviso.addEventListener("click", (evento) => {
    const limites = dialogoAviso.getBoundingClientRect();
    const dentroDoDialogo =
      evento.clientX >= limites.left &&
      evento.clientX <= limites.right &&
      evento.clientY >= limites.top &&
      evento.clientY <= limites.bottom;
    if (!dentroDoDialogo) {
      dialogoAviso.close();
    }
  });

  dialogoAviso.addEventListener("close", () => {
    if (elementoQueAbriuAviso) {
      elementoQueAbriuAviso.focus();
    }
  });
} else {
  elementosContato.forEach((elemento) => {
    if (elemento.hasAttribute("data-wa-msg")) {
      elemento.href = montarLinkWhatsapp(elemento.getAttribute("data-wa-msg"));
    } else {
      elemento.href = montarLinkEmail(elemento.getAttribute("data-email-mensagem"));
    }
  });
}

const prefereMovimentoReduzido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const elementosRevelados = document.querySelectorAll(".reveal");

if (!prefereMovimentoReduzido && "IntersectionObserver" in window) {
  const observadorRevelacao = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observadorRevelacao.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementosRevelados.forEach((elemento) => observadorRevelacao.observe(elemento));
} else {
  elementosRevelados.forEach((elemento) => elemento.classList.add("visible"));
}

const botaoFlutuante = document.querySelector(".whatsapp-flutuante");
const rodape = document.querySelector(".rodape");

if (botaoFlutuante && rodape && "IntersectionObserver" in window) {
  const observadorRodape = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        botaoFlutuante.classList.toggle("escondido", entrada.isIntersecting);
      });
    },
    { threshold: 0.05 }
  );

  observadorRodape.observe(rodape);
}

const botaoMenu = document.querySelector(".menu-alternar");
const listaNavegacao = document.getElementById("lista-navegacao");

if (botaoMenu && listaNavegacao) {
  function fecharMenu() {
    listaNavegacao.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  }

  botaoMenu.addEventListener("click", () => {
    const aberto = listaNavegacao.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });

  listaNavegacao.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && listaNavegacao.classList.contains("aberto")) {
      fecharMenu();
      botaoMenu.focus();
    }
  });
}
