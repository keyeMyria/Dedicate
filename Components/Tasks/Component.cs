namespace Websilk.Components.Dedicate
{
    public class Tasks: Component
    {

        public Tasks() { }

        public override string Name => "Tasks";
        public override string Path => "/Vendor/Dedicate/Components/Tasks/";
        public override int defaultWidth => 800;
        public override bool canResizeHeight => true;

        public override void Load()
        {
            scaffold = new Scaffold(S,  Path + "component.html");
            
            scaffold.Data["tasks"] = "";
        }
    }
}
