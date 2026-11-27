"""Pedido de herrajes y accesorios para Madecentro: cocina, clóset, baño y pecera.

Uso, desde la raíz del repositorio:

    python herramientas/build_pedido_herrajes.py

Escribe pedido-herrajes-madecentro.xlsx. Referencias Bonuit y precios de los despieces; equivalentes de las
partidas genéricas leídos en madecentro.com el 26/11/2026 (precios web con descuento, por confirmar en tienda).
"""
from pathlib import Path
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

RAIZ = Path(__file__).resolve().parent.parent
CAR, MOS, VER, OTRO = "En el carrito", "Preguntar en mostrador", "Verificar antes de pagar", "Otro proveedor"
OK = CAR

# mueble, producto, referencia, cant, unidad, precio unitario (None = sin precio), estado, nota
FILAS = [
 ("Cocina y baño", "Bisagra parche cierre lento (par)", "HBM897-01", 15, "par", 17750, CAR, "12 pares cocina + 3 pares baño."),
 ("Cocina", "Perfil gola superior 3 m", "PERALM64N", 1, "barra", 41215, CAR, "Tramos B1 150 + B3/B5/B4 1770; interrumpido en el horno."),
 ("Cocina", "Perfil gola media 3 m", "PERALM63N", 1, "barra", 51014, CAR, "Tramos B3 670 + B4 400."),
 ("Cocina", "Fijación metálica de gola con tornillo", "FIMFM65", 10, "u", 2998, CAR, "8 extremos + 2 apoyos intermedios."),
 ("Cocina", "Riel cierre lento 55 cm negro (par)", "HRE550-55N", 1, "par", 47034, CAR, "Cajón cubiertero B3."),
 ("Cocina", "Riel extensión total 55 cm (par)", "HRE126-55", 1, "par", 12560, CAR, "Basurero B4."),
 ("Cocina", "Platero 700 gris antracita", "HSO566-03G", 1, "u", 63539, CAR, ""),
 ("Cocina", "Cubiertero 360 × 480 × 50", "HSC910-40", 1, "u", 38791, CAR, ""),
 ("Cocina", "Condimentero 3 niveles cierre lento", "HSO317-15R", 1, "u", 122902, CAR, "Comprobar en tienda que entra en 120 mm libres."),
 ("Cocina", "Basurero con estructura", "HSO688-00", 1, "u", 109700, CAR, ""),
 ("Cocina", "Brazo neumático 80 N gris", "HEC080-03", 2, "u", 9126, VER, "El despiece decía 60 N (HEC060-03) y el carrito muestra el precio del de 60 N. Puerta S2 de 482 × 627, unos 3 kg con 2 brazos: confirmar con la tabla de peso del fabricante cuál corresponde."),
 ("Cocina y clóset", "Pata niveladora zócalo 100 mm", "FIMPP59", 30, "u", 2042, CAR, "24 cocina + 6 clóset."),
 ("Cocina", "Soporte de entrepaño con buje", "HVA057-00", 24, "u", 517, CAR, "Confirmar diámetro con la broca de las perforaciones."),
 ("Varios", "Escuadra en L 2\" zincada", "HVA151-51", 42, "u", 784, VER, "4 base de campana + 24 pecera + 2 anclaje de la pecera a la pared + 12 para colgar S1–S5 y el gabinete del espejo. Colgar gabinetes con 2 escuadras pequeñas es poco: mejor colgadores para mueble aéreo (mostrador); si no hay, 4 por gabinete."),
 ("Varios", "Tornillo de ensamble 6 × 2\" (caja × 100)", "HVT6020-50", 2, "caja", 6419, CAR, "Uniones intermedias y armado."),
 ("Varios", "Tornillo para aglomerado 6 × 5/8\" (caja × 100)", "HVT6058-15", 3, "caja", 2687, CAR, "2 cocina + 1 pecera: herrajes, bisagras y escuadras."),
 ("Varios", "Tarugo de madera 8 × 30 mm", "HVA356-02", 50, "u", 54, CAR, "Uno junto a cada minifix, con pegante."),
 ("Clóset", "Riel lateral 45 cm (par)", "HRE320-45", 3, "par", 11287, CAR, ""),
 ("Clóset", "Kit rodamientos Peralma (incluye tope)", "FSCPCM20", 1, "kit", 12730, CAR, "El tope amortiguado viene en el kit."),
 ("Clóset", "Perfil guía Peralma 2 m", "PERALMA50B", 1, "barra", 33278, CAR, "Recorrido 1920 mm."),
 ("Clóset", "Manija tubular 96 mm", "HMA310-02", 2, "u", 2743, CAR, ""),
 ("Clóset", "Tubo ovalado aluminio 3 m", "PERALM12", 1, "barra", 37115, CAR, "Tramos 810 + 1055 + 1055 = 2920: sobran solo 80 mm. Medir antes de cortar."),
 ("Clóset", "Soporte de tubo ovalado niquelado", "HTU100-01", 6, "u", 349, CAR, "Dos por tubo."),
 ("Pecera", "Bisagra cierre lento interior (par)", "HBM897-03", 2, "par", 16908, VER, "Puertas embutidas entre pilastras: confirmar en tienda que sea codo 18."),
 ("Pecera", "Escuadra pequeña 3/4\"", "HVA119-19", 14, "u", 344, CAR, "Tapa y fondos de gola."),
 ("Pecera", "Tornillo Autofix 6 × 1½\" (caja × 100)", "HVT615-00", 1, "caja", 5000, CAR, "Forro a pino."),
 ("Pecera", "Pasacables (hueco Ø60)", "HVA733-00", 2, "u", 1866, CAR, "En el espaldar."),
 ("Baño", "Pie amigo acero fijo 6 × 8 negro", "HVP408-02", 2, "u", 2836, VER, "FALTA EN EL CARRITO. Aparece en la web de Madecentro. Soporte del mueble y el granito al muro; si el granito es pesado, pedir uno más robusto en mostrador."),
 ("Cocina y baño", "Colgador para mueble aéreo (par)", "Preguntar en mostrador", 6, "par", None, MOS, "Recomendado en vez de las 12 escuadras de colgar. S1–S5 y gabinete del espejo."),
 ("Cocina", "Perfil LED con difusor, cinta y fuente", "Preguntar en mostrador", 1, "juego", None, MOS, "OPCIONAL. Elegir el perfil antes de fresar la ranura de S3–S5."),
 ("Pecera", "Nivelador M10 con base, 100 kg o más", "Ferretería", 6, "u", None, OTRO, "No está en Madecentro. Con su tuerca de inserción M10 (siguiente línea)."),
 ("Pecera", "Tuerca de inserción M10", "Ferretería", 6, "u", None, OTRO, "En la cara inferior del bastidor de pino."),
 ("Cocina, clóset, baño y pecera", "Juego 10 pernos + caja minifix madera 15 mm (Fixser)", "Homecenter 345839", 5, "juego", 23900, OTRO, "YA COMPRADO en Homecenter. 46 + 4 de reserva. Perno: taladro de 5 mm; caja: Ø15; paso de 8 mm desde el canto."),
]
FUERA = [
 ("Ya pedido", "Tableros RH15 y RH6, canto rígido y flexible, corte y canteado", "Madecentro · pedido de corte"),
 ("Cocina", "Mesón, lavaplatos, combo campana-horno-estufa, grifería y desagüe", "Homecenter y otros"),
 ("Baño", "Espejo y retal de granito, lavamanos, grifería y sifón", "Vidriería, marmolería y otros"),
 ("Pino", "Ventana, armazón de la pecera 50 × 50 y listón 4 × 4 del clóset", "Carpintería (pedido-corte-ventana-pino.pdf)"),
 ("Pecera", "40 tornillos 5 × 90: Deck Ruspert 10 × 3½\" (10 paquetes de 4)", "Homecenter, con los de la ventana"),
 ("Pecera", "Manta EVA o espuma 5 mm de 785 × 340", "Otros"),
 ("Varios", "Silicona neutra", "Cualquier ferretería"),
]


def main():
    wb = openpyxl.Workbook(); ws = wb.active; ws.title = "Pedido Madecentro"
    ink = "253B35"; thin = Side(style="thin", color="D8E0D8")
    ws["A1"] = "Pedido de herrajes y accesorios · Madecentro (carrito al 26/11/2026)"; ws["A1"].font = Font(bold=True, size=15, color=ink)
    ws["A2"] = ("Cocina, clóset, baño y pecera. Precios de referencia de los despieces y de madecentro.com (26/11/2026, con descuento web); "
                "confirmar en tienda. «Preguntar en mostrador» = equivalente por confirmar.")
    ws["A2"].font = Font(italic=True, color="59675D")
    cab = ["Mueble", "Producto", "Referencia", "Cant.", "Unidad", "Precio ref. COP", "Subtotal COP", "Estado", "Nota", "Comprado"]
    anchos = [14, 46, 26, 7, 9, 14, 14, 24, 70, 11]
    for j, (c, w) in enumerate(zip(cab, anchos), 1):
        x = ws.cell(4, j, c); x.font = Font(bold=True, color="FFFFFF"); x.fill = PatternFill("solid", fgColor=ink)
        x.alignment = Alignment(wrap_text=True, vertical="center"); ws.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
    color = {CAR: "E6F2EA", MOS: "FFF1C9", VER: "FCE4D6", OTRO: "DDEBF7"}
    for i, (m, prod, ref, q, u, p, est, nota) in enumerate(FILAS, 5):
        vals = [m, prod, ref, q, u, p, f'=IF(ISNUMBER(F{i}),D{i}*F{i},"")', est, nota, ""]
        for j, v in enumerate(vals, 1):
            c = ws.cell(i, j, v); c.alignment = Alignment(wrap_text=j in (2, 3, 9), vertical="top"); c.border = Border(bottom=thin)
        ws.cell(i, 8).fill = PatternFill("solid", fgColor=color[est])
        ws.cell(i, 6).number_format = ws.cell(i, 7).number_format = '"$"#,##0'
    last = 4 + len(FILAS)
    dv = DataValidation(type="list", formula1='"Sí,No,Pendiente"', allow_blank=True); ws.add_data_validation(dv); dv.add(f"J5:J{last}")
    t = last + 2
    ws.cell(t, 2, "Total con precio (incluye lo de otros proveedores con precio)").font = Font(bold=True)
    ws.cell(t, 7, f"=SUM(G5:G{last})").font = Font(bold=True); ws.cell(t, 7).number_format = '"$"#,##0'
    ws.cell(t + 1, 2, "Partidas sin precio (preguntar en tienda)")
    ws.cell(t + 1, 7, f'=COUNTBLANK(F5:F{last})')
    ws.cell(t + 3, 2, "Colores de Estado: verde = en el carrito · naranja = verificar antes de pagar · amarillo = preguntar en mostrador · azul = otro proveedor.").font = Font(italic=True, color="59675D")
    ws.freeze_panes = "A5"; ws.auto_filter.ref = f"A4:J{last}"
    ws.page_setup.orientation = "landscape"; ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True; ws.print_title_rows = "4:4"

    w2 = wb.create_sheet("No es de Madecentro")
    w2["A1"] = "Lo que se compra en otro lado"; w2["A1"].font = Font(bold=True, size=14, color=ink)
    for j, (c, w) in enumerate(zip(["Mueble", "Qué", "Dónde"], [14, 70, 40]), 1):
        x = w2.cell(3, j, c); x.font = Font(bold=True, color="FFFFFF"); x.fill = PatternFill("solid", fgColor=ink)
        w2.column_dimensions[openpyxl.utils.get_column_letter(j)].width = w
    for i, f in enumerate(FUERA, 4):
        for j, v in enumerate(f, 1):
            w2.cell(i, j, v).alignment = Alignment(wrap_text=True, vertical="top")
    wb.save(RAIZ / "pedido-herrajes-madecentro.xlsx")
    print("OK pedido-herrajes-madecentro.xlsx:", len(FILAS), "líneas")


if __name__ == "__main__":
    main()
