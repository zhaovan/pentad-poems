export default function IntermediaryScreen() {
  return (
    <>
      <p className="sans">
        The chinese lunisolar calendar (黄历) is a traditional time-tracking
        system meant to be useful to villagers and farmers for agricultural and
        cultural purposes. The history of the calendar is vast and complex (and
        spans different cultural contexts), but at its core tracks both the
        cycles of the moon and the sun. The calendar is divided into 24 solar
        terms (节气), each marking a specific astronomical event or natural
        phenomenon throughout the year. These solar terms can be further divided
        into three seasons (候), each lasting about five days, which often
        reflect a particular aspect of nature or change during that period. The
        Infinite Almanac is inspired by this traditional system and expands the
        72 lines to a full calendar cycle of 365 days. Written in a style
        inspired by the renga, each line corresponds to a day of the year and
        reflects the changing seasons, natural phenomena, and cultural events
        associated with that day, and is intended to be read in any order
        throughout the year.
      </p>
      <br />
      <p>
        Many thanks to{" "}
        <a href="https://ytliu0.github.io/ChineseCalendar/guliuli.html">
          Yuk Tung Liu
        </a>{" "}
        for this thorough documentation and calculations on the Chinese
        lunisolar calendar. The Chinese translations were done through Google
        translate and the Libre Translate API, and have not been reviewed by a
        native speaker (and so apologies for the inaccuracies in syntax or
        diction). This website was created by{" "}
        <a href="https://ivanzhao.me/">Ivan Zhao</a> during the{" "}
        <a href="https://www.welcometomyhomepage.net/">
          Welcome to My Homepage
        </a>{" "}
        residency.
      </p>
    </>
  );
}
