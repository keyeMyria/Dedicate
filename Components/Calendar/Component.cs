namespace Websilk.Components.Dedicate
{
    public class Calendar: Component
    {

        public Calendar() { }

        public override string Name => "Calendar";
        public override string Path => "/Vendor/Dedicate/Components/Calendar/";
        public override int defaultWidth => 800;
        public override bool canResizeHeight => true;

        public override void Load()
        {
            scaffold = new Scaffold(S,  Path + "component.html");
            
            scaffold.Data["calendar"] = "";
        }
    }
}
