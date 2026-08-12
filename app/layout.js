import "./styles.css";

export const metadata = {
  title: "Juegazo",
  description: "Reserva de juegos para cumpleanos y eventos"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

