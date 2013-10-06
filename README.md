###Beer attendance checklist

This is an example angularjs / nodejs single page web application. It was written very quickly in reponse to
an urgent demand from several members of a development team for a Friday drinks countdown. From very humble beginnings
the scope of the project blew out, much like a violently erupting volcano would.

Mission: What is goal besides making (beertime project | money)?
Vision: What do we believe about future? How will it help achieve mission?

1. Outcome
* What will beertime make easier or better for people?
* Define this clearly and test definition.

Beertime will allow people to set drinking dates for a group, at a designated place (virtual or bricks). Beertime
will do this better than other services by providing a task-focused UI. In other words, doing the thing that BT
does will be faster and more focused than other services.

2. Structure
* Work out required components to meet Outcome.
* Map relationships betwixt components.

AngularJS for front end.
NodeJS for back end.
CouchDB for back end database.

AngularJS is requested from back end via HTTP(s). Back end talks to DB for data acquisition. Back end responds to
front end requests for data.

3. Interaction
* Design interaction details. What are the micro-interactions? Sequences of behaviour and events?
What are UI components and how people will interact with or manipulate them? How will things move,
change and / or animate. Revisit system, evolve to match interactions. Keep iterating.

User lands at beertime.org, presented with landing page inc sign-in sign-up options which are clickable
buttons. User can see list of public groups on landing page, inc group data such as next date and # members.
Public groups can be interacted with (click) which opens group portal. User either sign-in or sign-up. Sign-up
presents user with sign-up options (g+, facebook, manual). Manual sign-up involves minimal fields (email, password).

When user sign-in, presented with list of groups of which user is member. User can click on group to open group
portal. If user is not part of groups, shown list of public groups.

In group portal user entry is shown at top, followed by alphabetical list of fellow group members. Each member occupies
one line in member list. User's line has controls for attendence at next group event. Date of next event is shown
prominently in group portal, as is countdown timer. If user is group caretaker, user can interact with event date
to change it.

4. Visual
Once 1,2,3 are well defined and working (prototyped), design the visual details. Make it look
beautiful and enjoyable. Now is the time for artistry.
