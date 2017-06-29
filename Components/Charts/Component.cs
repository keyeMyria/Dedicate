namespace Websilk.Components.Dedicate
{
    public class Charts: Component
    {

        public Charts() { }

        public override string Name => "Charts";
        public override string Path => "/Vendor/Dedicate/Components/Charts/";
        public override int defaultWidth => 800;
        public override bool canResizeHeight => true;

        public override void Load()
        {
            scaffold = new Scaffold(S,  Path + "component.html");
            
            scaffold.Data["charts"] = "";
        }
    }
}
