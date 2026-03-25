import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type Defenses = {
    turrets : Nat;
    shields : Nat;
    walls : Nat;
  };

  type Facilities = {
    electricityPlant : Bool;
    blockchainNode : Bool;
    dataCentre : Bool;
    aiLab : Bool;
  };

  type OldPlotState = {
    plotId : Nat;
    biome : Text;
    richness : Nat;
    lat : Float;
    lng : Float;
    owner : ?Principal.Principal;
    nftTokenId : ?Nat;
    iron : Nat;
    fuel : Nat;
    crystal : Nat;
    lastTick : Int;
    defenses : Defenses;
    facilities : Facilities;
    attackCooldown : Int;
    faction : ?Text;
    morale : Nat;
  };

  type NewPlotState = {
    plotId : Nat;
    biome : Text;
    richness : Nat;
    lat : Float;
    lng : Float;
    owner : ?Principal.Principal;
    nftTokenId : ?Nat;
    iron : Nat;
    fuel : Nat;
    crystal : Nat;
    lastTick : Int;
    defenses : Defenses;
    facilities : Facilities;
    attackCooldown : Int;
    faction : ?Text;
    morale : Nat;
    interceptorSystem : ?Text;
  };

  type PlayerState = {
    iron : Nat;
    fuel : Nat;
    crystal : Nat;
    frntBalance : Nat;
    plotsOwned : Nat;
    combatVictories : Nat;
    commanderType : ?Text;
    commanderAtk : Nat;
    commanderDef : Nat;
    satelliteExpiry : Int;
    reconTargets : [(Nat, Int)];
    empTargets : [(Nat, Int)];
  };

  type OldCombatEvent = {
    timestamp : Int;
    attacker : Principal.Principal;
    fromPlot : Nat;
    toPlot : Nat;
    success : Bool;
    atkPower : Nat;
    defPower : Nat;
  };

  type OldCombatState = {
    plots : Map.Map<Nat, OldPlotState>;
    players : Map.Map<Principal.Principal, PlayerState>;
    combatLog : Map.Map<Int, OldCombatEvent>;
  };

  type CombatEvent = {
    timestamp : Int;
    attacker : Principal.Principal;
    fromPlot : Nat;
    toPlot : Nat;
    success : Bool;
    atkPower : Nat;
    defPower : Nat;
    intercepted : Bool;
    interceptorType : ?Text;
    missileType : ?Text;
  };

  type OrbitalEvent = {
    eventType : Text;
    startTime : Int;
    duration : Int;
    affectedBiomes : [Text];
  };

  type NewCombatState = {
    plots : Map.Map<Nat, NewPlotState>;
    players : Map.Map<Principal.Principal, PlayerState>;
    combatLog : Map.Map<Int, CombatEvent>;
    interceptors : Map.Map<Nat, Text>;
  };

  public func run(old : OldCombatState) : NewCombatState {
    let newPlotStates = old.plots.map<Nat, OldPlotState, NewPlotState>(
      func(_, oldPlotState) {
        { oldPlotState with interceptorSystem = null };
      }
    );
    let newCombatEvents = old.combatLog.map<Int, OldCombatEvent, CombatEvent>(
      func(_, oldCombatEvent) {
        {
          oldCombatEvent with
          intercepted = false;
          interceptorType = null;
          missileType = null;
        };
      }
    );
    {
      plots = newPlotStates;
      players = old.players;
      combatLog = newCombatEvents;
      interceptors = Map.empty<Nat, Text>();
    };
  };
};
