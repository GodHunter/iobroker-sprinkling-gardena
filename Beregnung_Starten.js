const pfad   = "0_userdata.0.Beregnung.Garten.";
const device = "sonoff.0.Sonoff-Garten.POWER";
const alive  = getState( 'sonoff.0.Sonoff-Garten.alive' ).val; 

const debug  = true;

schedule("* 4-22 * * *", main);

function main(){

    if( debug )  log('-== STARTE BEWÄSSERUNGS-ROUTINE ==-');
    if( !alive ) log(device +' ist nicht erreichbar', 'error');

    //Objekte anlegen
    if(!existsState( pfad +'Allgemein.Aktiv' )) {
        createStates( pfad );
        return true;
    };

    const positionen = []; //Objekt hält wartende Positionen
    let total = 0; //Anzahl aller aktiven Positionen

    var selector = $('state[state.id=0_userdata.0.Beregnung.Garten.*._Aktiv]');    
    selector.each(function (obj, index) {
        
        //Alle aktiven Verteilerpositionen einlesen
        if( getState( obj ).val === true ){
            var objekt = obj.split(/\.(?=[^\.]+$)/);
            total++;

            //Alle wartenden Objekte einlesen
            if( getState( objekt[0] +'._Warte' ).val === true ) positionen.push( Number( objekt[0].slice(-1) ) );

        }
    
    });

    //Wenn Beregnung ausstehend und keine aktive Beregnung
    if( positionen.length !== 0 && getState( pfad +'Allgemein.Aktiv' ).val === false && alive ) {
        
        if( debug ) log( total +' Positionen sind eingetragen.' );

        let vtposition = Number( getState( pfad +'Verteiler.Allgemein.Position' ).val +1 );
        if( vtposition > total ) vtposition = 1;      
    
        if( positionen.includes( vtposition ) === false ){ //Umschalten wenn Kanal nicht wartend
            
            if(debug) log( 'Verteiler wird umgeschalten ( Bereich '+ vtposition +' )' );

            einschalten(  vtposition );
            setTimeout(
                function() {
                    ausschalten();
                }
            , 20000);

        } else { //Beregnung starten

            var dauer = Number( getState( pfad +'Verteiler.'+ vtposition +'.Dauer' ).val );
            if( debug ) log( 'Beregnung wird gestartet ( Bereich '+ Number( vtposition ) +' / '+ dauer +' Minuten )' );

            setState( pfad +'Allgemein.Aktiv', true, true );
            setState( pfad +'Allgemein.Restlaufzeit', dauer, true );
            setState( pfad +'Verteiler.'+ vtposition +'._Warte', false, true );

            //Nächste Beregnung zurücksetzen
            if( Number( getState( pfad +'Verteiler.'+ vtposition +'.NaechsteBeregnung' ).val ) === 0 ) setState( pfad +'Verteiler.'+ vtposition +'.NaechsteBeregnung', Number( getState( pfad +'Verteiler.'+ vtposition +'.Intervall' ).val ) );

            einschalten(  vtposition );

        }

    } else if( getState( pfad +'Allgemein.Aktiv' ).val === true ){ //Anhaltende Beregnung

        var laufzeit = Number( getState( pfad +'Allgemein.Restlaufzeit' ).val );
        
        if( Number( laufzeit-1 ) > 0 ) {
         
            if( debug ) log( 'Aktive Beregnung ( Bereich '+ getState( pfad +'Verteiler.Allgemein.Position' ).val +' / '+ Number( laufzeit-1 ) +' Minuten ).' );
            setState( pfad +'Allgemein.Restlaufzeit', Number( laufzeit-1 ), true );

        } else if( alive ) {

            if( debug ) log( 'Beregnung wird beendet ( Bereich '+ getState( pfad +'Verteiler.Allgemein.Position' ).val +' )' );
            setState( pfad +'Allgemein.Aktiv', false, true );
            setState( pfad +'Allgemein.Restlaufzeit', Number( 0 ), true );
            ausschalten();

        } else log( 'Die Beregnung konnte nicht beendet werden.', 'error');

    } else if( debug ) log('Keine geplante Beregnung.');

    if(debug) log('-== BEENDE BEWÄSSERUNGS-ROUTINE ==-');

}

function einschalten( x ){
    setState( pfad +'Verteiler.Allgemein.Position', Number( x ), true );
    setState( device, true );
}

function ausschalten(){
    setState( device, false );
}

function createStates(pfad){
    
    createState(pfad +'Allgemein.Automatik', false, {read: true, write: true, type: 'boolean', desc: 'Automatikmodus An / Aus'});
    createState(pfad +'Allgemein.Aktiv', false, {read: true, write: true, type: 'boolean', desc: 'Aktive Beregnung'});
    createState(pfad +'Allgemein.Restlaufzeit', 0, {read: true, write: true, type: 'number', unit: 'Minuten', desc: 'Warten auf laufende Bewässerung'});
    createState(pfad +'Verteiler.Allgemein.Position', 1, {read: true, write: true, type: 'number', desc: 'Aktuelle Position des Verteilers'});
    createState(pfad +'Verteiler.Allgemein.Gesamt', 4, {read: true, write: true, type: 'number', desc: 'Anzahl der angeschlossenen Ventile'});

    for (let i = 1; i <= 6; i++) {
        createState(pfad +'Verteiler.'+ i +'._Aktiv', false, {read: true, write: true, type: 'boolean', desc: 'Bereich angeschlossen'});
        createState(pfad +'Verteiler.'+ i +'.Dauer', 5, {read: true, write: true, type: 'number', unit: 'Minuten', desc: 'Dauer der Bewässerung'});
        createState(pfad +'Verteiler.'+ i +'._Warte', false, {read: true, write: true, type: 'boolean', desc: 'Wartet auf Bewässerung'});
        createState(pfad +'Verteiler.'+ i +'.Bezeichnung', 'Position '+ i, {read: true, write: true, type: 'number', desc: 'Nummer des Ventils'});
        createState(pfad +'Verteiler.'+ i +'.Intervall', 4, {read: true, write: true, type: 'number', unit: 'Tage', desc: 'Gewünschter Beregnungsintervall in Tagen'});
        createState(pfad +'Verteiler.'+ i +'.NaechsteBeregnung', 4, {read: true, write: true, type: 'number', unit: 'Tage',  desc: 'Verbleibende Tage bis zur Beregnung'});
    };

}
