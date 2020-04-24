var meta_input = document.getElementById('meta')
var margem_element = document.getElementById('margem')
var faturamento_input= document.getElementById('opt-faturamento')
var imposto_element= document.getElementById('imposto')
var lucro_element= document.getElementById('lucro')
var imposto = 0.15
var margem = 0

var fat_liquido = false
var venda = 0
var estrategias = [
    "Agressividade",
    "Rentabilidade",
    "Bloqueio",
    "Posicionamento"
]
var estrategia = 3

var parametros =[
    {descricao:"Regular", margem:0.3,estrategia:[0.55,0.8,0.75,	0.7]},
    {descricao:"TV", margem:0.05,estrategia:[0,	0,	0,	0.05]},
    {descricao:"Lâmina", margem:0.1,estrategia:[0.1,	0,	0.05,	0.05]},
    {descricao:"Encarte", margem:0.15,estrategia:[0.1,	0,	0.1,	0.1]},
    {descricao:"Ações Comerciais", margem:0.20,estrategia:[0.1,	0.15,	0.05,	0.05]},
    {descricao:"Ações Loja", margem:0.15,estrategia:[0.15,	0.05,	0.05,	0.05]}
]



document.addEventListener('loadend', initialize());

function initialize() {
    console.log('aplicacação iniciada...');
    meta_input.placeholder =  '0,00'
    imposto_element.innerHTML = "0,00%"
    calcula()
  }

function faturamento_change(el){
    console.log('camou')
    if(el.checked == true){
        fat_liquido = false
        console.log('faturamento liquido? SIM')
        //document.getElementById("box-impostos").style.display = "none";
        imposto_element.innerHTML = "0%"
    }else{
    fat_liquido = true
    console.log('faturamento liquido? NAO')
    //document.getElementById("box-impostos").style.display = "block";
    imposto_element.innerHTML = "15%"
    }
    console.log(fat_liquido)
    calcula();
}


function radio_change (radio) {
    estrategia = radio.value-1
    calcula();
}

function meta_change(el) {
    let val = parseFloat(el.value)
    el.value = parseFloat(el.value).toFixed(2)
      .replace('.', ',') // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    venda = val;
    calcula();
}

function formata(numero) {
    
    return parseFloat(numero).toFixed(2)
      .replace('.', ',') // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
   
}

function formataPercent(numero) {
    
    return parseFloat(numero).toFixed(2)
      .replace('.', ',') // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + "%"
   
}

function calcula(){
    console.log(venda)
    let fat_valor = venda
    if(fat_liquido){
        fat_valor = venda * (1-imposto)
        console.log("venda liquida: " + fat_valor)
    }
    
    let arr = []
    let t_par = 0
    let t_ven = 0
    let t_luc = 0
    let t_ctb = 0

    // MONTA JSON DATA 
  
    for (var i = 0; i < parametros.length; i++) {

       let obj = parametros[i]
        let values = []
        
        let part = parametros[i].estrategia[estrategia]
        let ven = fat_valor * part 
        let mar = parametros[i].margem 
        let luc = ven * mar
        let ctb = part * mar

        values[0] = parametros[i].descricao //"origem": "Regular",
        values[1] = formataPercent(part*100)
        values[2] = formata(ven)
        values[3] = mar * 100 + "%"
        values[4] = formata(luc)
        values[5] = formataPercent(ctb * 100)

        arr.push(values)
        console.log(JSON.stringify(values))
        t_par += part
        t_ven += ven
        t_luc += luc
        t_ctb += ctb
    }

    let totais = []
    totais[0] = "TOTAL"
    totais[1] = t_par * 100 + "%"
    totais[2] = formata(t_ven)
    totais[3] = formataPercent(t_ctb * 100)
    totais[4] = formata(t_luc)
    totais[5] = formataPercent(t_ctb * 100)

    arr.push(totais)

    //acerta os cards
    lucro_element.innerHTML =  totais[4] 
    margem_element.innerHTML =  totais[5]

    CreateTableFromJSON(arr)
}

function CreateTableFromJSON(dados) {
    
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [
        'Tipo',
        'Part %',
        'Venda R$',
        'Margem %',
        'Lucro R$',
        'Contribuição'
    ];

    var kk = []
    for (var i = 0; i < dados.length; i++) {
             for (var key in dados[i]) {
             if (kk.indexOf(key) === -1) {
                 kk.push(key);
             }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < dados.length; i++) {

        tr = table.insertRow(-1);
        let values = dados[i]
        for (var j = 0; j < values.length; j++) {
            var tabCell = tr.insertCell(-1);
            //console.log(dados[i][kk[j]])
            tabCell.innerHTML = values[j];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("table-row");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}